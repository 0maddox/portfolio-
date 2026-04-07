import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apiUrl } from "../utils/api";

const githubUsername = "0maddox";
const GITHUB_CACHE_KEY = "portfolio_projects_github_cache_v1";
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000;
const DEFAULT_PROJECT_IMAGE = "/favicon.svg";

const baseProjects = [
  {
    title: "CODM Tournament Platform",
    description:
      "A platform for organizing and managing Call of Duty Mobile tournaments, including player registration and match tracking.",
    image: "/images/codm.png",
    tech: ["React", "CSS", "Ruby on Rails", "PostgreSQL"],
    live: "https://your-live-link.com",
    github: "https://github.com/your-repo",
    category: "Gaming",
    status: "In Progress",
    problem: "No easy way to manage tournament registration and match flow in one place.",
    solution: "Built a structured platform for registrations, brackets, and match tracking.",
    features: ["Player registration", "Match tracking", "Tournament board"],
    challenges: "Designing reliable tournament progression and clear UX for competitive players.",
    learned: "Improved full-stack planning, component architecture, and product-first thinking.",
  },
  {
    title: "Couples Game App",
    description:
      "An interactive web app designed for couples and social settings with engaging and dynamic gameplay features.",
    image: "/images/game.png",
    tech: ["React", "JavaScript", "CSS"],
    live: "https://your-live-link.com",
    github: "https://github.com/your-repo",
    category: "Interactive",
    status: "Live",
    problem: "Many social/couples games lack polished digital interaction and flow.",
    solution: "Created an interactive game interface with dynamic rounds and smooth transitions.",
    features: ["Dynamic prompts", "Session flow", "Mobile-friendly UI"],
    challenges: "Balancing playful UX with responsive performance across devices.",
    learned: "Strengthened animation timing and interaction design decisions.",
  },
];

const techIcons = {
  React: "https://cdn.simpleicons.org/react/61DAFB",
  JavaScript: "https://cdn.simpleicons.org/javascript/F7DF1E",
  HTML: "https://cdn.simpleicons.org/html5/E34F26",
  CSS: "https://cdn.simpleicons.org/css/1572B6",
  "Ruby on Rails": "https://cdn.simpleicons.org/rubyonrails/D30001",
  PostgreSQL: "https://cdn.simpleicons.org/postgresql/4169E1",
  SQL: "https://cdn.simpleicons.org/mysql/4479A1",
  Codebase: "https://cdn.simpleicons.org/github/FFFFFF",
};

const githubImageExtensions = /\.(png|jpe?g|webp|gif|svg|avif|bmp|tiff?|heic|heif)$/i;

function decodeBase64Utf8(base64Value) {
  try {
    return decodeURIComponent(escape(window.atob(base64Value.replace(/\n/g, ""))));
  } catch {
    try {
      return window.atob(base64Value.replace(/\n/g, ""));
    } catch {
      return "";
    }
  }
}

function stripMarkdown(markdownText) {
  return markdownText
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_`~#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractReadmeSummary(markdownText, fallback) {
  if (!markdownText) return fallback;

  const lines = markdownText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .filter((line) => !line.startsWith("!"));

  const candidate = lines.find((line) => {
    const plain = stripMarkdown(line);
    return plain.length >= 32 && /[a-zA-Z]/.test(plain);
  });

  const summary = stripMarkdown(candidate || "");
  return summary || fallback;
}

async function fetchReadmeDescription(owner, repoName, signal, fallback) {
  try {
    const readmeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/readme`,
      {
        headers: { Accept: "application/vnd.github+json" },
        signal,
      }
    );

    if (!readmeRes.ok) {
      return fallback;
    }

    const readmeData = await readmeRes.json();
    const decoded = readmeData?.content ? decodeBase64Utf8(readmeData.content) : "";
    return extractReadmeSummary(decoded, fallback);
  } catch {
    return fallback;
  }
}

async function fetchRepoImages(owner, repoName, branch, signal) {
  if (!owner || !repoName || !branch) return [];

  try {
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/${branch}?recursive=1`,
      {
        headers: { Accept: "application/vnd.github+json" },
        signal,
      }
    );

    if (!treeRes.ok) {
      return [];
    }

    const treeData = await treeRes.json();
    const imagePaths = Array.isArray(treeData?.tree)
      ? treeData.tree
          .filter((item) => item?.type === "blob" && typeof item?.path === "string")
          .map((item) => item.path)
          .filter((repoPath) => githubImageExtensions.test(repoPath))
      : [];

    return imagePaths.map((repoPath) => {
      const encodedPath = repoPath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
      return `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${encodedPath}`;
    });
  } catch {
    return [];
  }
}

function statusClass(status) {
  if (status === "Live") return "live";
  if (status === "In Progress") return "progress";
  return "soon";
}

function normalizeProject(project) {
  const normalizedTitle = (project?.title || "Untitled Project").toString();
  const normalizedDescription = (project?.description || "Project details coming soon.").toString();
  const normalizedCategory = (project?.category || "Web App").toString();
  const normalizedStatus = (project?.status || "In Progress").toString();
  const normalizedProblem = (project?.problem || "Problem statement not provided yet.").toString();
  const normalizedSolution = (project?.solution || "Solution details will be added soon.").toString();
  const normalizedChallenges = (project?.challenges || "Challenges to be documented.").toString();
  const normalizedLearned = (project?.learned || "Learning outcomes to be added.").toString();
  const normalizedLive = (project?.live || project?.url || "").toString();
  const normalizedGithub = (project?.github || project?.url || "https://github.com/0maddox").toString();

  const images = Array.isArray(project?.images)
    ? project.images.filter(Boolean)
    : [];
  const fallbackImage = project?.image || DEFAULT_PROJECT_IMAGE;
  const normalizedTech = Array.isArray(project?.tech) && project.tech.length > 0
    ? project.tech.filter(Boolean).map((item) => item.toString())
    : ["Codebase"];
  const normalizedFeatures = Array.isArray(project?.features) && project.features.length > 0
    ? project.features.filter(Boolean).map((item) => item.toString())
    : ["Details in progress"];

  return {
    ...project,
    title: normalizedTitle,
    description: normalizedDescription,
    category: normalizedCategory,
    status: normalizedStatus,
    problem: normalizedProblem,
    solution: normalizedSolution,
    challenges: normalizedChallenges,
    learned: normalizedLearned,
    live: normalizedLive,
    github: normalizedGithub,
    tech: normalizedTech,
    features: normalizedFeatures,
    manualImages: Boolean(project?.manualImages),
    image: fallbackImage,
    images: images.length > 0 ? images : [fallbackImage],
  };
}

function slugifyProjectTitle(title) {
  return (title || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function readResponsePayload(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  try {
    const text = await response.text();
    return { message: text || "Request failed." };
  } catch {
    return {};
  }
}

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeProject, setActiveProject] = useState(null);
  const [githubProjects, setGithubProjects] = useState([]);
  const [editableProjects, setEditableProjects] = useState(baseProjects.map(normalizeProject));
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState(baseProjects[0]?.title || "");
  const [featuredProjectTitle, setFeaturedProjectTitle] = useState(baseProjects[0]?.title || "");
  const [editorMessage, setEditorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageIndexes, setImageIndexes] = useState({});
  const [maximizedMedia, setMaximizedMedia] = useState({});
  const [ignoreBackdropUntil, setIgnoreBackdropUntil] = useState(0);
  const [publicImages, setPublicImages] = useState([]);
  const [cardUploadState, setCardUploadState] = useState({});
  const [libraryChoiceByProject, setLibraryChoiceByProject] = useState({});
  const [imageLinkByProject, setImageLinkByProject] = useState({});
  const [selectedCardFilesByProject, setSelectedCardFilesByProject] = useState({});
  const [imagePickerForProject, setImagePickerForProject] = useState("");
  const [imagePickerSelections, setImagePickerSelections] = useState({});
  const [pendingAutoSaveProject, setPendingAutoSaveProject] = useState("");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadLocalPageData = async () => {
      try {
        const [sessionRes, dataRes] = await Promise.all([
          fetch(apiUrl("/api/check-session"), { credentials: "include" }),
          fetch(apiUrl("/api/data"), { credentials: "include" }),
        ]);

        if (cancelled) return;

        const sessionData = await sessionRes.json();
        setIsAdmin(Boolean(sessionData.loggedIn));

        if (dataRes.ok) {
          const siteData = await dataRes.json();
          const storedProjects = Array.isArray(siteData?.projects) && siteData.projects.length > 0
            ? siteData.projects
            : baseProjects;
          const normalizedStored = storedProjects.map(normalizeProject);
          setEditableProjects(normalizedStored);
          setSelectedProjectTitle(normalizedStored[0]?.title || "");
          setFeaturedProjectTitle((siteData?.featuredProjectTitle || normalizedStored[0]?.title || "").toString());
        }
      } catch {
        if (cancelled) return;
        setIsAdmin(false);
      }
    };

    const loadGithubProjects = async () => {
      try {
        const cachedRaw = sessionStorage.getItem(GITHUB_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (
            cached &&
            Array.isArray(cached.items) &&
            typeof cached.savedAt === "number" &&
            Date.now() - cached.savedAt < GITHUB_CACHE_TTL_MS
          ) {
            setGithubProjects(cached.items);
            return;
          }
        }
      } catch {
        // If cache parsing fails, continue with network fetch.
      }

      try {
        const githubRes = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`,
          { signal: controller.signal }
        );

        if (!githubRes.ok || cancelled) return;

        const data = await githubRes.json();

        const mapped = Array.isArray(data)
          ? (await Promise.all(
              data
                .filter((repo) => !repo.fork)
                .map(async (repo) => {
                  const fallbackDescription = repo.description || "Repository synced from GitHub.";
                  const [readmeDescription, repoImages] = await Promise.all([
                    fetchReadmeDescription(
                      githubUsername,
                      repo.name,
                      controller.signal,
                      fallbackDescription
                    ),
                    fetchRepoImages(
                      githubUsername,
                      repo.name,
                      repo.default_branch,
                      controller.signal
                    ),
                  ]);

                  const fallbackImage = "/images/portfolio.png";
                  const normalizedImages = repoImages.length > 0 ? repoImages : [fallbackImage];

                  return normalizeProject({
                    title: repo.name,
                    description: readmeDescription,
                    image: normalizedImages[0],
                    images: normalizedImages,
                    tech: [repo.language || "Codebase"],
                    live: repo.homepage || "",
                    github: repo.html_url,
                    category: "Web App",
                    status: repo.homepage ? "Live" : "In Progress",
                    manualImages: true,
                    problem: "Need a maintainable project structure and clear implementation path.",
                    solution: "Implemented and iterated features directly from real project requirements.",
                    features: ["Version controlled", "Ongoing iteration", "Practical architecture"],
                    challenges: "Managing scope and technical trade-offs while improving quality.",
                    learned: "Better workflow discipline, debugging approach, and delivery speed.",
                  });
                })
            ))
          : [];

        setGithubProjects(mapped);
        try {
          sessionStorage.setItem(
            GITHUB_CACHE_KEY,
            JSON.stringify({ items: mapped, savedAt: Date.now() })
          );
        } catch {
          // Ignore cache write failures.
        }
      } catch {
        if (!cancelled) {
          setGithubProjects([]);
        }
      }
    };

    const loadPublicImages = async () => {
      try {
        const res = await fetch(apiUrl("/api/public-images"), { credentials: "include" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (Array.isArray(data?.images)) {
          setPublicImages(data.images);
        }
      } catch {
        // Ignore public image loading failure and keep defaults.
      }
    };

    loadLocalPageData();
    loadGithubProjects();
    loadPublicImages();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const allProjects = useMemo(() => {
    return [...editableProjects, ...githubProjects];
  }, [editableProjects, githubProjects]);

  const allProjectsWithPublicImages = useMemo(() => {
    const galleryFallback = publicImages[0] || DEFAULT_PROJECT_IMAGE;

    if (!Array.isArray(publicImages) || publicImages.length === 0) {
      return allProjects;
    }

    return allProjects.map((project) => {
      if (project.manualImages) {
        return project;
      }

      const slug = slugifyProjectTitle(project.title);
      const matching = publicImages.filter((imgPath) => imgPath.toLowerCase().includes(slug));

      if (matching.length === 0) {
        return normalizeProject({
          ...project,
          image: project.image || galleryFallback,
          images: Array.isArray(project.images) && project.images.length > 0
            ? project.images
            : [galleryFallback],
        });
      }

      return normalizeProject({
        ...project,
        image: matching[0],
        images: matching,
      });
    });
  }, [allProjects, publicImages]);

  const filteredProjects = useMemo(() => {
    return allProjectsWithPublicImages.filter((project) => {
      const categoryPass = selectedCategory === "All" || project.category === selectedCategory;
      const statusPass = selectedStatus === "All" || project.status === selectedStatus;
      return categoryPass && statusPass;
    });
  }, [allProjectsWithPublicImages, selectedCategory, selectedStatus]);

  const availableCategories = useMemo(() => {
    const unique = new Set(allProjectsWithPublicImages.map((project) => project.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [allProjectsWithPublicImages]);

  const availableStatuses = useMemo(() => {
    const unique = new Set(allProjectsWithPublicImages.map((project) => project.status).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [allProjectsWithPublicImages]);

  const featuredProject =
    allProjectsWithPublicImages.find((project) => project.title === featuredProjectTitle) ||
    allProjectsWithPublicImages[0] ||
    null;

  const featuredOptions = useMemo(() => {
    const seen = new Set();
    return allProjectsWithPublicImages
      .map((project) => project.title)
      .filter((title) => {
        if (!title || seen.has(title)) return false;
        seen.add(title);
        return true;
      });
  }, [allProjectsWithPublicImages]);

  const cycleProjectImage = (projectKey, totalImages, direction) => {
    if (totalImages <= 1) return;
    setImageIndexes((prev) => {
      const current = prev[projectKey] || 0;
      const next = (current + direction + totalImages) % totalImages;
      return { ...prev, [projectKey]: next };
    });
  };

  const toggleMediaSize = (projectKey) => {
    setMaximizedMedia((prev) => ({ ...prev, [projectKey]: !prev[projectKey] }));
  };

  const handleUploadProjectImages = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedProjectTitle || files.length === 0) return;

    setEditorMessage("");
    setIsUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("project", selectedProjectTitle);

        const res = await fetch(apiUrl("/api/upload-project-image"), {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.url) {
          setEditorMessage(data.message || "Failed to upload one or more images.");
          setIsUploading(false);
          return;
        }

        uploadedUrls.push(data.url);
      }

      setEditableProjects((prev) => prev.map((project) => {
        if (project.title !== selectedProjectTitle) return project;

        const nextImages = [...(project.images || []), ...uploadedUrls].filter(Boolean);
        return {
          ...project,
          image: nextImages[0] || project.image,
          images: nextImages,
        };
      }));

      setEditorMessage(`${uploadedUrls.length} image(s) uploaded. Click Save Project Media to persist.`);
    } catch {
      setEditorMessage("Unable to upload images right now.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProjectMedia = async () => {
    setEditorMessage("");
    setIsSaving(true);

    try {
      const res = await fetch(apiUrl("/api/data"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projects: editableProjects,
          featuredProjectTitle,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setEditorMessage(data.message || "Could not save project media.");
        return;
      }

      setEditorMessage("Project media saved successfully.");
    } catch {
      setEditorMessage("Unable to save project media right now.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!pendingAutoSaveProject) return;

    const projectTitle = pendingAutoSaveProject;
    setPendingAutoSaveProject("");

    const autoSave = async () => {
      setIsSaving(true);
      try {
        const res = await fetch(apiUrl("/api/data"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            projects: editableProjects,
            featuredProjectTitle,
          }),
        });
        const data = await readResponsePayload(res);

        if (!res.ok || !data.success) {
          setCardUploadState((prev) => ({
            ...prev,
            [projectTitle]: {
              uploading: false,
              message: data.message || "Applied, but auto-save failed.",
            },
          }));
          return;
        }

        setCardUploadState((prev) => ({
          ...prev,
          [projectTitle]: {
            uploading: false,
            message: "Selected images applied and auto-saved.",
          },
        }));
      } catch {
        setCardUploadState((prev) => ({
          ...prev,
          [projectTitle]: {
            uploading: false,
            message: "Applied, but auto-save failed. Please try Save Project Media.",
          },
        }));
      } finally {
        setIsSaving(false);
      }
    };

    autoSave();
  }, [pendingAutoSaveProject, editableProjects, featuredProjectTitle]);

  const openProjectModal = (project) => {
    // Guard against the opening click being interpreted as a backdrop close.
    setIgnoreBackdropUntil(Date.now() + 220);
    window.setTimeout(() => {
      setActiveProject(project);
    }, 0);
  };

  const handleBackdropClose = (event) => {
    if (event.target !== event.currentTarget) return;
    if (Date.now() < ignoreBackdropUntil) return;
    setActiveProject(null);
  };

  const clearSelectedCardFiles = (projectTitle) => {
    setSelectedCardFilesByProject((prev) => {
      const current = prev[projectTitle] || [];
      current.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });

      const next = { ...prev };
      delete next[projectTitle];
      return next;
    });
  };

  const handleSelectCardImages = (projectTitle, event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    clearSelectedCardFiles(projectTitle);

    const selected = files.map((file, idx) => ({
      id: `${projectTitle}-${Date.now()}-${idx}`,
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedCardFilesByProject((prev) => ({
      ...prev,
      [projectTitle]: selected,
    }));

    setCardUploadState((prev) => ({
      ...prev,
      [projectTitle]: { uploading: false, message: `${selected.length} image(s) selected. Preview before upload.` },
    }));
  };

  const handleUploadCardImage = async (projectTitle) => {
    const selected = selectedCardFilesByProject[projectTitle] || [];
    const files = selected.map((item) => item.file).filter(Boolean);

    if (files.length === 0) {
      setCardUploadState((prev) => ({
        ...prev,
        [projectTitle]: { uploading: false, message: "Choose image(s) first." },
      }));
      return;
    }

    setCardUploadState((prev) => ({
      ...prev,
      [projectTitle]: { uploading: true, message: `Uploading ${files.length} image(s)...` },
    }));

    try {
      const uploadedUrls = [];

      for (const file of files) {
        let uploaded = false;
        let failureMessage = "Upload failed.";

        const formData = new FormData();
        formData.append("image", file);
        formData.append("project", projectTitle);

        const res = await fetch(apiUrl("/api/upload-project-image"), {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await readResponsePayload(res);

        if (res.ok && data?.url) {
          uploadedUrls.push(data.url);
          uploaded = true;
        } else if (res.status === 403) {
          setCardUploadState((prev) => ({
            ...prev,
            [projectTitle]: { uploading: false, message: "Not authorized. Please log in again." },
          }));
          return;
        } else {
          const statusMessage = `${res.status}${res.statusText ? ` ${res.statusText}` : ""}`;
          failureMessage = data?.message || `Project image upload failed (${statusMessage}).`;
        }

        if (!uploaded) {
          setCardUploadState((prev) => ({
            ...prev,
            [projectTitle]: { uploading: false, message: failureMessage },
          }));
          return;
        }
      }

      setPublicImages((prev) => {
        const merged = [...uploadedUrls, ...prev];
        return Array.from(new Set(merged));
      });

      setEditableProjects((prev) => prev.map((project) => {
        if (project.title !== projectTitle) return project;
        const nextImages = [...uploadedUrls, ...(project.images || [])].filter(Boolean);
        return normalizeProject({
          ...project,
          manualImages: true,
          image: nextImages[0],
          images: nextImages,
        });
      }));

      setCardUploadState((prev) => ({
        ...prev,
        [projectTitle]: {
          uploading: false,
          message: `${uploadedUrls.length} image(s) uploaded. Click Save Project Media to persist.`
        },
      }));
      clearSelectedCardFiles(projectTitle);
    } catch {
      setCardUploadState((prev) => ({
        ...prev,
        [projectTitle]: {
          uploading: false,
          message: "Could not upload right now. Ensure backend is running (npm run server).",
        },
      }));
    }
  };

  const updateProjectImagesByTitle = (projectTitle, updater) => {
    const matchedEditable = editableProjects.some((project) => project.title === projectTitle);

    setEditableProjects((prev) => prev.map((project) => {
      if (project.title !== projectTitle) return project;
      return normalizeProject(updater(project));
    }));

    if (!matchedEditable) {
      setGithubProjects((prev) => prev.map((project) => {
        if (project.title !== projectTitle) return project;
        return normalizeProject(updater(project));
      }));
    }

    return matchedEditable;
  };

  const handleAssignLibraryImage = (projectTitle) => {
    const selectedImage = libraryChoiceByProject[projectTitle];
    if (!selectedImage) {
      setCardUploadState((prev) => ({
        ...prev,
        [projectTitle]: { uploading: false, message: "Select an image from library first." },
      }));
      return;
    }

    updateProjectImagesByTitle(projectTitle, (project) => {
      const nextImages = [selectedImage, ...(project.images || []).filter((img) => img !== selectedImage)].filter(Boolean);
      return {
        ...project,
        manualImages: true,
        image: nextImages[0] || project.image,
        images: nextImages,
      };
    });

    setCardUploadState((prev) => ({
      ...prev,
      [projectTitle]: { uploading: false, message: "Image assigned to this project." },
    }));
  };

  const handleRemoveProjectImage = (projectTitle, imagePath) => {
    updateProjectImagesByTitle(projectTitle, (project) => {
      const nextImages = (project.images || []).filter((img) => img !== imagePath);
      const fallback = project.image || publicImages[0] || DEFAULT_PROJECT_IMAGE;
      return {
        ...project,
        manualImages: true,
        image: nextImages[0] || fallback,
        images: nextImages.length > 0 ? nextImages : [fallback],
      };
    });

    setCardUploadState((prev) => ({
      ...prev,
      [projectTitle]: { uploading: false, message: "Image removed from this project." },
    }));
  };

  const getSelectableImagesForProject = (project) => {
    const currentImages = Array.isArray(project?.images) ? project.images : [];
    const merged = [...currentImages, ...publicImages].filter(Boolean);
    return Array.from(new Set(merged));
  };

  const handleOpenImagePicker = (project) => {
    const initialSelection = Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : [project.image || publicImages[0] || DEFAULT_PROJECT_IMAGE];

    setImagePickerSelections((prev) => ({
      ...prev,
      [project.title]: initialSelection,
    }));
    setImagePickerForProject(project.title);
  };

  const handleToggleImageSelection = (projectTitle, imagePath) => {
    setImagePickerSelections((prev) => {
      const existing = prev[projectTitle] || [];
      const hasImage = existing.includes(imagePath);
      const next = hasImage
        ? existing.filter((img) => img !== imagePath)
        : [...existing, imagePath];

      return {
        ...prev,
        [projectTitle]: next,
      };
    });
  };

  const handleApplyImageSelection = (projectTitle) => {
    const selectedImages = (imagePickerSelections[projectTitle] || []).filter(Boolean);
    if (selectedImages.length === 0) {
      setCardUploadState((prev) => ({
        ...prev,
        [projectTitle]: { uploading: false, message: "Select at least one image." },
      }));
      return;
    }

    const updatedEditableProject = updateProjectImagesByTitle(projectTitle, (project) => ({
      ...project,
      manualImages: true,
      image: selectedImages[0],
      images: selectedImages,
    }));

    setImagePickerForProject("");

    if (updatedEditableProject) {
      setCardUploadState((prev) => ({
        ...prev,
        [projectTitle]: { uploading: false, message: "Applying images and auto-saving..." },
      }));
      setPendingAutoSaveProject(projectTitle);
      return;
    }

    setCardUploadState((prev) => ({
      ...prev,
      [projectTitle]: { uploading: false, message: "Selected images applied locally for this synced project." },
    }));
  };

  const isValidImageLink = (value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleAddImageLink = (projectTitle) => {
    const link = (imageLinkByProject[projectTitle] || "").trim();
    if (!isValidImageLink(link)) {
      setCardUploadState((prev) => ({
        ...prev,
        [projectTitle]: { uploading: false, message: "Please enter a valid image URL (http/https)." },
      }));
      return;
    }

    updateProjectImagesByTitle(projectTitle, (project) => {
      const nextImages = [link, ...(project.images || []).filter((img) => img !== link)].filter(Boolean);
      return {
        ...project,
        manualImages: true,
        image: nextImages[0] || project.image,
        images: nextImages,
      };
    });

    setImageLinkByProject((prev) => ({ ...prev, [projectTitle]: "" }));
    setCardUploadState((prev) => ({
      ...prev,
      [projectTitle]: { uploading: false, message: "Image link added to this project." },
    }));
  };

  return (
    <section className="projects-premium-page">
      <h2>My Projects</h2>

      {isAdmin && (
        <div className="projects-admin-controls">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setShowEditor((prev) => !prev);
              setEditorMessage("");
            }}
          >
            {showEditor ? "Close Edit Projects" : "Edit Projects"}
          </button>

          {showEditor && (
            <div className="add-project-card projects-editor-panel">
              <label htmlFor="project-picker">Select project</label>
              <select
                id="project-picker"
                value={selectedProjectTitle}
                onChange={(e) => setSelectedProjectTitle(e.target.value)}
              >
                {editableProjects.map((project) => (
                  <option key={project.title} value={project.title}>
                    {project.title}
                  </option>
                ))}
              </select>

              <label htmlFor="featured-project-picker">Featured project</label>
              <select
                id="featured-project-picker"
                value={featuredProjectTitle}
                onChange={(e) => setFeaturedProjectTitle(e.target.value)}
              >
                {featuredOptions.map((title) => (
                  <option key={`featured-${title}`} value={title}>
                    {title}
                  </option>
                ))}
              </select>

              <label className="project-upload-label" htmlFor="project-images-input">
                Upload Project Images
                <input
                  id="project-images-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadProjectImages}
                  disabled={isUploading}
                />
              </label>

              <button
                type="button"
                onClick={handleSaveProjectMedia}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Project Media"}
              </button>

              {editorMessage && <p className="project-form-message">{editorMessage}</p>}
            </div>
          )}
        </div>
      )}

      {featuredProject && (
        <motion.article
          className="featured-project"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="project-eyebrow">Featured Project</p>
          <img
            src={(featuredProject.images && featuredProject.images[0]) || featuredProject.image}
            alt={featuredProject.title}
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = publicImages[0] || DEFAULT_PROJECT_IMAGE;
            }}
          />
          <h3>{featuredProject.title}</h3>
          <p>{featuredProject.description}</p>
        </motion.article>
      )}

      <div className="project-filter-groups">
        <div className="project-filter-row">
          <span className="project-filter-group-label">Category</span>
          {availableCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`project-filter-chip ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="project-filter-row">
          <span className="project-filter-group-label">Status</span>
          {availableStatuses.map((status) => (
            <button
              key={status}
              type="button"
              className={`project-filter-chip ${selectedStatus === status ? "active" : ""}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-premium-grid">
        {filteredProjects.map((project, index) => (
          <motion.article
            key={`${project.title}-${index}`}
            className="project-premium-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -5, scale: 1.01 }}
            onClick={() => openProjectModal(project)}
          >
            {(() => {
              const projectKey = `${project.title}-${index}`;
              const images = Array.isArray(project.images) && project.images.length > 0
                ? project.images
                : [project.image || "/images/portfolio.png"];
              const currentIndex = imageIndexes[projectKey] || 0;
              const safeIndex = currentIndex >= images.length ? 0 : currentIndex;

              return (
                <div className={`project-media-wrap ${maximizedMedia[projectKey] ? "media-maximized" : ""}`}>
                  <img
                    src={images[safeIndex]}
                    alt={`${project.title} screenshot ${safeIndex + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = publicImages[0] || DEFAULT_PROJECT_IMAGE;
                    }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="project-media-arrow arrow-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleProjectImage(projectKey, images.length, -1);
                        }}
                        aria-label="Previous project image"
                      >
                        &#8249;
                      </button>
                      <button
                        type="button"
                        className="project-media-arrow arrow-right"
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleProjectImage(projectKey, images.length, 1);
                        }}
                        aria-label="Next project image"
                      >
                        &#8250;
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="project-media-size-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMediaSize(projectKey);
                    }}
                    aria-label={maximizedMedia[projectKey] ? "Minimize project image" : "Maximize project image"}
                  >
                    {maximizedMedia[projectKey] ? "-" : "+"}
                  </button>
                  {images.length > 1 && (
                    <span className="project-image-count">
                      {safeIndex + 1}/{images.length}
                    </span>
                  )}

                  <span className={`status-badge ${statusClass(project.status)}`}>{project.status}</span>
                  <div className="project-hover-overlay">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <img src="https://cdn.simpleicons.org/googlechrome/FFFFFF" alt="" aria-hidden="true" />
                        Live Demo
                      </a>
                    )}
                    <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <img src="https://cdn.simpleicons.org/github/FFFFFF" alt="" aria-hidden="true" />
                      GitHub
                    </a>
                  </div>
                </div>
              );
            })()}

            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-stack">
                {project.tech.map((tech) => (
                  <span key={tech}>
                    <img src={techIcons[tech] || techIcons.Codebase} alt="" aria-hidden="true" />
                    {tech}
                  </span>
                ))}
              </div>

              {isAdmin && (
                <div
                  className="card-upload-row"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label className="project-upload-label" htmlFor={`card-upload-${index}`}>
                    Choose Project Image(s)
                    <input
                      id={`card-upload-${index}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleSelectCardImages(project.title, e)}
                      disabled={Boolean(cardUploadState[project.title]?.uploading)}
                    />
                  </label>

                  {selectedCardFilesByProject[project.title]?.length > 0 && (
                    <div className="card-selected-preview-grid">
                      {selectedCardFilesByProject[project.title].map((item) => (
                        <article key={item.id} className="card-selected-preview-item">
                          <img src={item.previewUrl} alt={item.name} />
                          <span>{item.name}</span>
                        </article>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn card-library-assign-btn"
                    disabled={Boolean(cardUploadState[project.title]?.uploading)}
                    onClick={() => handleUploadCardImage(project.title)}
                  >
                    {(cardUploadState[project.title]?.uploading) ? "Uploading..." : "Upload Selected"}
                  </button>

                  <button
                    type="button"
                    className="btn card-save-media-btn"
                    disabled={isSaving}
                    onClick={handleSaveProjectMedia}
                  >
                    {isSaving ? "Saving..." : "Save Project Media"}
                  </button>

                  <div className="card-library-row">
                    <select
                      value={libraryChoiceByProject[project.title] || ""}
                      onChange={(e) => {
                        const selectedPath = e.target.value;
                        setLibraryChoiceByProject((prev) => ({
                          ...prev,
                          [project.title]: selectedPath,
                        }));
                      }}
                    >
                      <option value="">Choose from /public/images</option>
                      {publicImages.map((imgPath) => (
                        <option key={`${project.title}-${imgPath}`} value={imgPath}>
                          {imgPath.replace("/images/", "")}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn card-library-assign-btn"
                      onClick={() => handleAssignLibraryImage(project.title)}
                    >
                      Use Image
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn card-image-picker-toggle"
                    onClick={() => handleOpenImagePicker(project)}
                  >
                    Choose Images to Display
                  </button>

                  {imagePickerForProject === project.title && (
                    <div className="card-image-picker-pop">
                      <p>Select image(s) for this project:</p>
                      <div className="card-image-picker-grid">
                        {getSelectableImagesForProject(project).map((imgPath) => {
                          const selectedList = imagePickerSelections[project.title] || [];
                          const isSelected = selectedList.includes(imgPath);
                          return (
                            <button
                              key={`${project.title}-picker-${imgPath}`}
                              type="button"
                              className={`card-image-picker-item ${isSelected ? "selected" : ""}`}
                              onClick={() => handleToggleImageSelection(project.title, imgPath)}
                              title={imgPath}
                            >
                              <img src={imgPath} alt={imgPath} />
                              <span>{imgPath.replace("/images/", "").replace("/uploads/", "")}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="card-image-picker-actions">
                        <button
                          type="button"
                          className="btn card-library-assign-btn"
                          onClick={() => handleApplyImageSelection(project.title)}
                        >
                          Apply Selected Images
                        </button>
                        <button
                          type="button"
                          className="btn card-library-assign-btn"
                          onClick={() => setImagePickerForProject("")}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="card-link-row">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={imageLinkByProject[project.title] || ""}
                      onChange={(e) => {
                        const linkValue = e.target.value;
                        setImageLinkByProject((prev) => ({
                          ...prev,
                          [project.title]: linkValue,
                        }));
                      }}
                    />
                    <button
                      type="button"
                      className="btn card-library-assign-btn"
                      onClick={() => handleAddImageLink(project.title)}
                    >
                      Add Link
                    </button>
                  </div>

                  <div className="card-assigned-images">
                    {(project.images || []).map((imgPath) => (
                      <button
                        key={`${project.title}-${imgPath}`}
                        type="button"
                        className="card-assigned-image-pill"
                        onClick={() => handleRemoveProjectImage(project.title, imgPath)}
                        title="Remove image from this project"
                      >
                        {imgPath.replace("/images/", "").replace("/uploads/", "")}
                        <span aria-hidden="true"> x</span>
                      </button>
                    ))}
                  </div>

                  {cardUploadState[project.title]?.message && (
                    <p className="project-form-message card-upload-message">
                      {cardUploadState[project.title].message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      {activeProject && (
        <div className="project-modal-backdrop" onClick={handleBackdropClose}>
          <motion.div
            className="project-modal"
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setActiveProject(null)}>
              Close
            </button>
            <h3>{activeProject.title}</h3>
            <p><strong>What is it?</strong> {activeProject.description}</p>
            <p><strong>What problem does it solve?</strong> {activeProject.problem}</p>
            <p><strong>Solution:</strong> {activeProject.solution}</p>
            <p><strong>Key Features:</strong> {activeProject.features.join(", ")}</p>
            <p><strong>Challenges faced:</strong> {activeProject.challenges}</p>
            <p><strong>What I learned:</strong> {activeProject.learned}</p>
            <p><strong>Tech used:</strong> {activeProject.tech.join(", ")}</p>
            <div className="project-modal-links">
              {activeProject.live && (
                <a href={activeProject.live} target="_blank" rel="noopener noreferrer">
                  <img src="https://cdn.simpleicons.org/googlechrome/FFFFFF" alt="" aria-hidden="true" />
                  Can I see it live?
                </a>
              )}
              <a href={activeProject.github} target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.simpleicons.org/github/FFFFFF" alt="" aria-hidden="true" />
                Can I view the code?
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}