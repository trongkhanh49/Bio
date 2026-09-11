/* =========================================================
   GLOBAL
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let unlocked = false;
let muted = false;

let currentBackground = 0;

let synthContext = null;
let synthGain = null;
let synthTimer = null;
let synthIndex = 0;


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadConfig();

    createParticles();

    createContributionGraph();

    setupReveal();

    setupCursor();

    setupTilt();

    setupBackgroundButton();

    setupKeyboard();

    setupMusic();

    setupSmoothLinks();

    setupPreloader();

    $("#year").textContent = new Date().getFullYear();

});


/* =========================================================
   LOAD CONFIG
========================================================= */

function loadConfig() {

    const p = config.profile;

    $("#enterName").textContent = p.name;

    $("#enterQuote").textContent = p.quote;

    $("#enterAvatar").src = p.avatar;

    $("#navAvatar").src = p.avatar;

    $("#navName").textContent = p.name.split(" ")[0];

    $("#heroAvatar").src = p.avatar;

    $("#heroName").textContent = p.name;

    $("#heroStatus").textContent = p.status;

    $("#heroDescription").textContent =
        p.bio[1] || "Developer";

    $("#profileName").textContent = p.name;

    $("#profileUsername").textContent =
        p.username;

    $("#profileStatus").textContent =
        p.status;

    $("#profileLocation").textContent =
        p.location;

    $("#profileQuote").textContent =
        p.quote;

    $("#heroDecoration").src =
        p.decoration;

    $(".profile-decoration").src =
        p.decoration;


    /* BIO */

    const bioList = $("#bioList");

    bioList.innerHTML = "";

    p.bio.forEach((line, index) => {

        const div =
            document.createElement("div");

        div.className = "bio-line";

        div.style.animationDelay =
            `${index * 100}ms`;

        div.textContent = line;

        bioList.appendChild(div);

    });


    /* SOCIAL */

    const socialGrid =
        $("#socialGrid");

    socialGrid.innerHTML = "";

    config.social.forEach((social) => {

        const a =
            document.createElement("a");

        a.href = social.url;

        a.target = "_blank";

        a.rel = "noopener noreferrer";

        a.className =
            "social-card reveal";

        a.innerHTML = `
            <div
                class="social-icon"
                style="color:${social.color}"
            >
                <i class="${social.icon}"></i>
            </div>

            <div class="social-text">
                <strong>${social.name}</strong>
                <span>${social.username}</span>
            </div>

            <i
                class="fa-solid fa-arrow-up-right-from-square"
                style="
                    margin-left:auto;
                    color:rgba(255,255,255,.25);
                    font-size:10px;
                "
            ></i>
        `;

        socialGrid.appendChild(a);

    });


    /* SKILLS */

    const skillsGrid =
        $("#skillsGrid");

    skillsGrid.innerHTML = "";

    config.skills.forEach((skill) => {

        const card =
            document.createElement("div");

        card.className =
            "skill-card reveal";

        card.innerHTML = `
            <div class="skill-top">

                <div class="skill-name">

                    <i
                        class="${skill.icon}
                        skill-icon"
                    ></i>

                    ${skill.name}

                </div>

                <span class="skill-percent">
                    ${skill.level}%
                </span>

            </div>

            <div class="skill-bar">

                <div
                    class="skill-progress"
                    data-level="${skill.level}"
                ></div>

            </div>
        `;

        skillsGrid.appendChild(card);

    });


    /* PROJECTS */

    const projectsGrid =
        $("#projectsGrid");

    projectsGrid.innerHTML = "";

    config.projects.forEach((project) => {

        const card =
            document.createElement("article");

        card.className =
            "project-card reveal tilt";

        card.dataset.language =
            project.language === "Python"
                ? "Python"
                : project.language === "JavaScript"
                    ? "JavaScript"
                    : "Other";

        card.innerHTML = `
            <div class="project-icon">
                ${project.icon}
            </div>

            <h3>
                ${project.name}
            </h3>

            <p>
                ${project.description}
            </p>

            <div class="project-meta">

                <div class="project-language">

                    <span class="language-dot"></span>

                    ${project.language}

                </div>

                <a
                    class="project-link"
                    href="${project.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View
                    <i class="fa-solid fa-arrow-right"></i>
                </a>

            </div>
        `;

        projectsGrid.appendChild(card);

    });


    /* MUSIC */

    if (config.music.enabled) {

        $("#musicTitle").textContent =
            config.music.title;

        $("#musicArtist").textContent =
            config.music.artist;

        $("#musicCover").src =
            config.music.cover;

        $("#volumeSlider").value =
            config.music.volume;

    } else {

        $(".music-section").style.display =
            "none";

    }

}


/* =========================================================
   PRELOADER
========================================================= */

function setupPreloader() {

    window.addEventListener("load", () => {

        setTimeout(() => {

            $("#preloader")
                .classList
                .add("hidden");

        }, 700);

    });

}


/* =========================================================
   ENTER
========================================================= */

function enterWebsite() {

    if (unlocked) return;

    unlocked = true;

    document.body.classList.add("unlocked");

    $("#enterScreen")
        .classList
        .add("hidden");

    startMusic();

    showToast(
        "Welcome to my profile ✨"
    );

    setTimeout(() => {

        $("#enterScreen").style.display =
            "none";

    }, 1200);

}


$("#enterButton").addEventListener(
    "click",
    enterWebsite
);


$("#enterScreen").addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            $("#enterScreen")
        ) {
            enterWebsite();
        }

    }
);


/* =========================================================
   KEYBOARD
========================================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !unlocked
            ) {
                enterWebsite();
            }

            if (
                event.key === "Escape" &&
                unlocked
            ) {
                toggleMute();
            }

        }
    );

}


/* =========================================================
   MUSIC
========================================================= */

const audio = $("#audio");

function setupMusic() {

    if (!config.music.enabled)
        return;

    audio.loop =
        config.music.loop;

    audio.volume =
        config.music.volume;

    if (
        config.music.mode ===
        "file"
    ) {

        audio.src =
            config.music.file;

    }

    $("#musicPlay")
        .addEventListener(
            "click",
            toggleMusic
        );

    $("#muteButton")
        .addEventListener(
            "click",
            toggleMute
        );

    $("#volumeSlider")
        .addEventListener(
            "input",
            (event) => {

                const value =
                    Number(event.target.value);

                audio.volume =
                    value;

                if (synthGain) {

                    synthGain.gain.value =
                        muted ? 0 : value;

                }

            }
        );

}


async function startMusic() {

    if (!config.music.enabled)
        return;

    if (
        config.music.mode ===
        "synth"
    ) {

        startSynth();

        return;

    }

    try {

        await audio.play();

        document.body.classList
            .add("music-playing");

        updateMusicButton(true);

    } catch (error) {

        console.log(
            "Music requires user interaction."
        );

    }

}


function toggleMusic() {

    if (
        config.music.mode ===
        "synth"
    ) {

        if (synthTimer) {

            stopSynth();

        } else {

            startSynth();

        }

        return;
    }


    if (audio.paused) {

        audio.play();

        document.body.classList
            .add("music-playing");

        updateMusicButton(true);

    } else {

        audio.pause();

        document.body.classList
            .remove("music-playing");

        updateMusicButton(false);

    }

}


function updateMusicButton(playing) {

    $("#musicPlay").innerHTML =
        playing
            ? `<i class="fa-solid fa-pause"></i>`
            : `<i class="fa-solid fa-play"></i>`;

}


/* =========================================================
   MUTE
========================================================= */

function toggleMute() {

    muted = !muted;

    audio.muted =
        muted;

    if (synthGain) {

        synthGain.gain.value =
            muted
                ? 0
                : config.music.volume;

    }

    $("#muteButton").innerHTML =
        muted
            ? `<i class="fa-solid fa-volume-xmark"></i>`
            : `<i class="fa-solid fa-volume-high"></i>`;

    showToast(
        muted
            ? "Music muted"
            : "Music unmuted"
    );

}


/* =========================================================
   SYNTH MUSIC
========================================================= */

function startSynth() {

    if (synthTimer)
        return;

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContext)
        return;

    if (!synthContext) {

        synthContext =
            new AudioContext();

        synthGain =
            synthContext.createGain();

        synthGain.gain.value =
            muted
                ? 0
                : config.music.volume;

        synthGain.connect(
            synthContext.destination
        );

    }

    synthContext.resume();

    const notes = [
        261.63,
        329.63,
        392.00,
        523.25,
        392.00,
        329.63,
        293.66,
        349.23
    ];

    function playNote() {

        if (!synthContext)
            return;

        const now =
            synthContext.currentTime;

        const oscillator =
            synthContext.createOscillator();

        const gain =
            synthContext.createGain();

        oscillator.type =
            "sine";

        oscillator.frequency.value =
            notes[synthIndex];

        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.12,
            now + 0.04
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.45
        );

        oscillator.connect(gain);

        gain.connect(
            synthGain
        );

        oscillator.start(now);

        oscillator.stop(
            now + 0.5
        );

        synthIndex =
            (synthIndex + 1) %
            notes.length;

    }

    playNote();

    synthTimer =
        setInterval(
            playNote,
            500
        );

    document.body.classList
        .add("music-playing");

    updateMusicButton(true);

}


function stopSynth() {

    clearInterval(
        synthTimer
    );

    synthTimer = null;

    document.body.classList
        .remove("music-playing");

    updateMusicButton(false);

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    if (
        !config.effects.particles
    ) return;

    const canvas =
        $("#particles");

    const ctx =
        canvas.getContext("2d");

    let particles = [];

    function resize() {

        canvas.width =
            window.innerWidth *
            devicePixelRatio;

        canvas.height =
            window.innerHeight *
            devicePixelRatio;

        ctx.scale(
            devicePixelRatio,
            devicePixelRatio
        );

    }

    resize();

    window.addEventListener(
        "resize",
        resize
    );


    const count =
        Math.min(
            130,
            Math.floor(
                window.innerWidth / 10
            )
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        particles.push({

            x:
                Math.random() *
                window.innerWidth,

            y:
                Math.random() *
                window.innerHeight,

            size:
                Math.random() *
                1.8 + .4,

            speed:
                Math.random() *
                .35 + .05,

            opacity:
                Math.random() *
                .6 + .1,

            drift:
                (Math.random() - .5)
                * .25

        });

    }


    function animate() {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        particles.forEach((p) => {

            p.y -= p.speed;

            p.x += p.drift;


            if (p.y < -10) {

                p.y =
                    window.innerHeight + 10;

            }

            if (
                p.x < -10 ||
                p.x >
                window.innerWidth + 10
            ) {

                p.x =
                    Math.random() *
                    window.innerWidth;

            }


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(180,160,255,${p.opacity})`;

            ctx.fill();

        });


        requestAnimationFrame(
            animate
        );

    }

    animate();

}


/* =========================================================
   CURSOR
========================================================= */

function setupCursor() {

    if (
        !config.effects.cursorGlow
    ) {

        $("#cursorGlow").style.display =
            "none";

        return;

    }

    let mouseX =
        window.innerWidth / 2;

    let mouseY =
        window.innerHeight / 2;

    let glowX = mouseX;
    let glowY = mouseY;


    window.addEventListener(
        "mousemove",
        (event) => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

        }
    );


    function animate() {

        glowX +=
            (mouseX - glowX)
            * .12;

        glowY +=
            (mouseY - glowY)
            * .12;

        $("#cursorGlow").style.left =
            `${glowX}px`;

        $("#cursorGlow").style.top =
            `${glowY}px`;

        requestAnimationFrame(
            animate
        );

    }

    animate();

}


/* =========================================================
   3D TILT
========================================================= */

function setupTilt() {

    if (!config.effects.card3D)
        return;

    document.addEventListener(
        "mousemove",
        (event) => {

            const cards =
                document.querySelectorAll(
                    ".tilt"
                );

            cards.forEach((card) => {

                if (
                    window.innerWidth < 800
                )
                    return;

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) /
                        centerY) *
                    -3;

                const rotateY =
                    ((x - centerX) /
                        centerX) *
                    3;

                card.style.transform =
                    `
                    perspective(900px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateZ(5px)
                    `;

            });

        }
    );


    document.addEventListener(
        "mouseleave",
        () => {

            document
                .querySelectorAll(".tilt")
                .forEach((card) => {

                    card.style.transform =
                        "";

                });

        }
    );

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function setupReveal() {

    if (!config.effects.scrollReveal)
        return;

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add("visible");

                        }

                    }
                );

            },
            {
                threshold: .12
            }
        );


    document
        .querySelectorAll(".reveal")
        .forEach((element) => {

            observer.observe(
                element
            );

        });


    /* SKILL BARS */

    const skillObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            const bar =
                                entry.target;

                            bar.style.width =
                                `${bar.dataset.level}%`;

                            skillObserver
                                .unobserve(bar);

                        }

                    }
                );

            },
            {
                threshold: .5
            }
        );


    document
        .querySelectorAll(
            ".skill-progress"
        )
        .forEach((bar) => {

            skillObserver.observe(
                bar
            );

        });

}


/* =========================================================
   CONTRIBUTION GRAPH
========================================================= */

function createContributionGraph() {

    const graph =
        $("#graphGrid");

    if (!graph)
        return;

    graph.innerHTML = "";

    for (
        let i = 0;
        i < 196;
        i++
    ) {

        const cell =
            document.createElement("div");

        cell.className =
            "graph-cell";

        const random =
            Math.random();

        if (random > .75) {

            const level =
                Math.floor(
                    Math.random() * 4
                ) + 1;

            cell.classList.add(
                `active-${level}`
            );

        }

        graph.appendChild(
            cell
        );

    }

}


/* =========================================================
   BACKGROUND SWITCH
========================================================= */

function setupBackgroundButton() {

    const button =
        $("#themeButton");

    button.addEventListener(
        "click",
        () => {

            currentBackground++;

            if (
                currentBackground >=
                config.backgrounds.length
            ) {

                currentBackground = 0;

            }

            const bg =
                config.backgrounds[
                    currentBackground
                ];

            $("#background").style.background =
                bg.background;

            showToast(
                `Theme: ${bg.name}`
            );

        }
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message) {

    const toast =
        $("#toast");

    toast.querySelector("span")
        .textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


/* =========================================================
   GITHUB API
========================================================= */

async function loadGitHub() {

    const username =
        config.profile.username;

    try {

        const response =
            await fetch(
                `https://api.github.com/users/${username}`
            );

        if (!response.ok)
            throw new Error();

        const data =
            await response.json();


        $("#githubUsername")
            .textContent =
            `@${username}`;

        animateNumber(
            $("#repoCount"),
            data.public_repos
        );

        animateNumber(
            $("#followerCount"),
            data.followers
        );

        animateNumber(
            $("#followingCount"),
            data.following
        );


    } catch (error) {

        console.log(
            "GitHub API unavailable."
        );

    }

}

loadGitHub();


function animateNumber(
    element,
    target
) {

    let current = 0;

    const duration = 1200;

    const start =
        performance.now();


    function update(time) {

        const progress =
            Math.min(
                (time - start) /
                duration,
                1
            );

        current =
            Math.floor(
                target *
                (1 -
                    Math.pow(
                        1 - progress,
                        3
                    ))
            );

        element.textContent =
            current;

        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        } else {

            element.textContent =
                target;

        }

    }

    requestAnimationFrame(
        update
    );

}


/* =========================================================
   SMOOTH LINKS
========================================================= */

function setupSmoothLinks() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const target =
                        document.querySelector(
                            link.getAttribute("href")
                        );

                    if (!target)
                        return;

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );

        });

}


/* =========================================================
   BROKEN IMAGE FALLBACK
========================================================= */

document.addEventListener(
    "error",
    (event) => {

        if (
            event.target.tagName !==
            "IMG"
        ) return;

        event.target.style.opacity =
            "0";

    },
    true
);

/* =========================================================
   V2 EXPERIENCE LAYER
========================================================= */

(() => {
    const onReady = (fn) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
        }
    };

    onReady(() => {
        setupProjectFiltersV2();
        setupActiveNavV2();
        setupBackTopV2();
        setupDiscordCopyV2();
        setupMiniPlayerV2();
        setupScrollProgressV2();
        setupSpotlightCardsV2();
        setupImageFallbackV2();
        document.body.classList.add("experience-v2");
    });

    function setupProjectFiltersV2() {
        const grid = document.querySelector("#projectsGrid");
        const filter = document.querySelector("#projectFilter");
        const count = document.querySelector("#projectCount");
        if (!grid || !filter) return;

        const buttons = [...filter.querySelectorAll(".filter-button")];

        const render = (value) => {
            const cards = [...grid.querySelectorAll(".project-card")];
            let shown = 0;
            cards.forEach((card) => {
                const language = card.dataset.language || "Other";
                const visible = value === "all" || language === value;
                card.hidden = !visible;
                if (visible) shown++;
            });
            if (count) count.textContent = `${shown} project${shown === 1 ? "" : "s"}`;
        };

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                buttons.forEach((b) => b.classList.remove("active"));
                button.classList.add("active");
                render(button.dataset.filter);
            });
        });

        // Existing cards are generated before this layer initializes.
        [...grid.querySelectorAll(".project-card")].forEach((card, i) => {
            const project = config.projects[i];
            card.dataset.language = project?.language === "Python"
                ? "Python"
                : project?.language === "JavaScript"
                    ? "JavaScript"
                    : "Other";
        });
        render("all");
    }

    function setupActiveNavV2() {
        const links = [...document.querySelectorAll(".nav-links a[href^='#']")];
        const sections = links
            .map((link) => document.querySelector(link.getAttribute("href")))
            .filter(Boolean);

        const update = () => {
            const marker = window.scrollY + window.innerHeight * 0.32;
            let current = sections[0]?.id;
            sections.forEach((section) => {
                if (section.offsetTop <= marker) current = section.id;
            });
            links.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${current}`
                );
            });
        };

        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    function setupBackTopV2() {
        const button = document.querySelector("#backTop");
        if (!button) return;

        const update = () => button.classList.toggle("show", window.scrollY > 700);
        window.addEventListener("scroll", update, { passive: true });
        button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        update();
    }

    function setupDiscordCopyV2() {
        const copy = async () => {
            const username = config.discord?.username || config.profile?.username || "";
            try {
                await navigator.clipboard.writeText(username);
                showToast(`Copied Discord: ${username}`);
            } catch {
                showToast("Copy failed — please copy it manually.");
            }
        };

        ["#copyDiscord", "#copyDiscordCta"].forEach((selector) => {
            document.querySelector(selector)?.addEventListener("click", copy);
        });

        const discordButton = document.querySelector("#discordButton");
        if (discordButton && config.discord?.invite) {
            discordButton.href = config.discord.invite;
        }
    }

    function setupMiniPlayerV2() {
        const mini = document.querySelector("#musicMini");
        const miniPlay = document.querySelector("#miniPlay");
        const miniTitle = document.querySelector("#miniTitle");
        const miniArtist = document.querySelector("#miniArtist");
        const miniDisc = document.querySelector("#miniDisc");
        if (!mini || !miniPlay) return;

        if (config.music?.title) miniTitle.textContent = config.music.title;
        if (config.music?.artist) miniArtist.textContent = config.music.artist;
        if (config.music?.cover) miniDisc.style.backgroundImage = `url("${config.music.cover}")`;

        const sync = () => {
            const playing = document.body.classList.contains("music-playing");
            mini.classList.toggle("playing", playing);
            miniPlay.innerHTML = playing
                ? '<i class="fa-solid fa-pause"></i>'
                : '<i class="fa-solid fa-play"></i>';
        };

        miniPlay.addEventListener("click", () => {
            document.querySelector("#musicPlay")?.click();
            setTimeout(sync, 50);
        });

        setInterval(sync, 700);
        sync();
    }

    function setupScrollProgressV2() {
        const bar = document.createElement("div");
        bar.className = "scroll-progress";
        bar.innerHTML = "<span></span>";
        document.body.appendChild(bar);

        const fill = bar.firstElementChild;
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            fill.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
        };
        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    function setupSpotlightCardsV2() {
        const selector = ".glass-card, .social-card, .skill-card, .project-card";
        document.addEventListener("pointermove", (event) => {
            document.querySelectorAll(selector).forEach((card) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                card.style.setProperty("--mx", `${x}px`);
                card.style.setProperty("--my", `${y}px`);
            });
        }, { passive: true });
    }

    function setupImageFallbackV2() {
        document.querySelectorAll("img").forEach((img) => {
            img.addEventListener("error", () => img.classList.add("image-missing"), { once: true });
        });
    }
})();


/* =========================================================
   ADMIN CUSTOMIZER
========================================================= */

const ADMIN_STORAGE_KEY = "bio_admin_config_v1";
const ADMIN_AUTH_KEY = "bio_admin_unlocked_v1";

function getBaseConfig() {
    try {
        return JSON.parse(JSON.stringify(config));
    } catch (error) {
        return {};
    }
}

function getEffectiveConfig() {
    const base = getBaseConfig();

    try {
        const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (!saved) return base;

        const parsed = JSON.parse(saved);
        return deepMerge(base, parsed);
    } catch (error) {
        console.warn("Admin config could not be loaded.", error);
        return base;
    }
}

function deepMerge(target, source) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
        return source;
    }

    Object.keys(source).forEach((key) => {
        const value = source[key];

        if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            target[key] &&
            typeof target[key] === "object" &&
            !Array.isArray(target[key])
        ) {
            target[key] = deepMerge(target[key], value);
        } else {
            target[key] = value;
        }
    });

    return target;
}

function applyAdminConfig() {
    const effective = getEffectiveConfig();

    // Make the runtime config editable without rebuilding the site.
    Object.keys(config).forEach((key) => delete config[key]);
    Object.assign(config, effective);

    loadConfig();

    if (typeof setupMusic === "function") {
        try {
            setupMusic();
        } catch (error) {
            console.warn("Music refresh skipped.", error);
        }
    }

    if (typeof setupBackgroundButton === "function") {
        try {
            setupBackgroundButton();
        } catch (error) {
            console.warn("Background refresh skipped.", error);
        }
    }
}

function setupAdmin() {
    const panel = $("#adminPanel");
    const launcher = $("#adminLauncher");
    const close = $("#adminClose");
    const login = $("#adminLogin");
    const editor = $("#adminEditor");
    const passcode = $("#adminPasscode");
    const loginButton = $("#adminLoginBtn");
    const loginError = $("#adminLoginError");
    const jsonEditor = $("#adminJson");
    const saveButton = $("#adminSave");
    const resetButton = $("#adminReset");
    const formatButton = $("#adminFormat");
    const importButton = $("#adminImport");
    const exportButton = $("#adminExport");
    const fileInput = $("#adminFileInput");
    const lockButton = $("#adminLock");

    if (!panel || !launcher) return;

    const configuredPasscode = () =>
        config.admin && config.admin.passcode
            ? String(config.admin.passcode)
            : "CHANGE-ME-1234";

    const openPanel = () => {
        panel.classList.add("is-open");
        panel.setAttribute("aria-hidden", "false");
        document.body.classList.add("admin-open");

        const unlockedNow = sessionStorage.getItem(ADMIN_AUTH_KEY) === "1";

        if (unlockedNow) {
            login.hidden = true;
            editor.hidden = false;
            jsonEditor.value = JSON.stringify(getEffectiveConfig(), null, 2);
            setTimeout(() => jsonEditor.focus(), 50);
        } else {
            login.hidden = false;
            editor.hidden = true;
            loginError.textContent = "";
            passcode.value = "";
            setTimeout(() => passcode.focus(), 50);
        }
    };

    const closePanel = () => {
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        document.body.classList.remove("admin-open");
    };

    const unlock = () => {
        if (passcode.value === configuredPasscode()) {
            sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
            login.hidden = true;
            editor.hidden = false;
            loginError.textContent = "";
            jsonEditor.value = JSON.stringify(getEffectiveConfig(), null, 2);
            showToast("Admin unlocked");
            setTimeout(() => jsonEditor.focus(), 50);
        } else {
            loginError.textContent = "Sai mã admin.";
            passcode.select();
        }
    };

    const save = () => {
        try {
            const parsed = JSON.parse(jsonEditor.value);

            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                throw new Error("Config must be a JSON object.");
            }

            // Admin credentials are kept in the base config and are not replaced
            // by accidental edits to the saved override.
            const safeConfig = JSON.parse(JSON.stringify(parsed));
            if (!safeConfig.admin) {
                safeConfig.admin = getBaseConfig().admin || {
                    enabled: true,
                    passcode: "CHANGE-ME-1234",
                    shortcut: "Ctrl+Shift+A"
                };
            }

            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(safeConfig));
            applyAdminConfig();
            jsonEditor.value = JSON.stringify(getEffectiveConfig(), null, 2);

            showToast("Đã lưu & áp dụng cấu hình");
        } catch (error) {
            showToast("JSON không hợp lệ: " + error.message);
        }
    };

    const reset = () => {
        if (!confirm("Reset toàn bộ thay đổi admin trên trình duyệt này?")) return;

        localStorage.removeItem(ADMIN_STORAGE_KEY);
        applyAdminConfig();
        jsonEditor.value = JSON.stringify(getEffectiveConfig(), null, 2);
        showToast("Đã reset về cấu hình gốc");
    };

    const format = () => {
        try {
            jsonEditor.value = JSON.stringify(JSON.parse(jsonEditor.value), null, 2);
            showToast("Đã format JSON");
        } catch (error) {
            showToast("Không thể format: JSON không hợp lệ");
        }
    };

    const exportConfig = () => {
        const blob = new Blob([JSON.stringify(getEffectiveConfig(), null, 2)], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "bio-admin-config.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const importConfig = () => fileInput.click();

    const lock = () => {
        sessionStorage.removeItem(ADMIN_AUTH_KEY);
        closePanel();
        showToast("Admin đã khóa");
    };

    launcher.addEventListener("click", openPanel);
    close?.addEventListener("click", closePanel);
    panel.querySelector("[data-admin-close]")?.addEventListener("click", closePanel);
    loginButton?.addEventListener("click", unlock);
    saveButton?.addEventListener("click", save);
    resetButton?.addEventListener("click", reset);
    formatButton?.addEventListener("click", format);
    exportButton?.addEventListener("click", exportConfig);
    importButton?.addEventListener("click", importConfig);
    lockButton?.addEventListener("click", lock);

    passcode?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") unlock();
    });

    fileInput?.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            jsonEditor.value = String(reader.result || "");
            showToast("Đã import. Kiểm tra rồi bấm Save & Apply.");
        };
        reader.readAsText(file);
        fileInput.value = "";
    });

    document.addEventListener("keydown", (event) => {
        const shortcut = (config.admin?.shortcut || "Ctrl+Shift+A").toLowerCase();

        if (
            shortcut.includes("ctrl") &&
            shortcut.includes("shift") &&
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "a"
        ) {
            event.preventDefault();
            openPanel();
        }

        if (event.key === "Escape" && panel.classList.contains("is-open")) {
            closePanel();
        }
    });

    if (config.admin?.enabled === false) {
        launcher.hidden = true;
    }

    // Apply saved admin overrides as early as possible.
    if (localStorage.getItem(ADMIN_STORAGE_KEY)) {
        applyAdminConfig();
    }
}

// Initialize admin after the normal page boot sequence.
document.addEventListener("DOMContentLoaded", setupAdmin);


/* =========================================================
   BIO V3 — INTERACTION ENGINE
   PC + mobile/PE friendly, dependency-light, graceful fallback.
========================================================= */
(() => {
    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => [...r.querySelectorAll(s)];

    const scrollToTarget = (target) => {
        if (!target) return;
        const el = typeof target === "string" ? q(target) : target;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const findSection = (name) => {
        const normalized = String(name).toLowerCase();
        return qa("section, main > div, [id]").find(el => {
            const text = `${el.id || ""} ${el.className || ""} ${el.getAttribute("aria-label") || ""}`.toLowerCase();
            return text.includes(normalized);
        });
    };

    function setupCommandPalette() {
        const palette = q("#siteCommandPalette");
        const input = q("#siteCommandInput");
        const results = q("#siteCommandResults");
        if (!palette || !input || !results) return;

        const commands = [
            { title: "Home", icon: "fa-house", action: () => scrollToTarget("#home") },
            { title: "Profile / About", icon: "fa-user", action: () => scrollToTarget(findSection("profile") || findSection("about")) },
            { title: "Projects", icon: "fa-code", action: () => scrollToTarget(findSection("project")) },
            { title: "Skills", icon: "fa-bolt", action: () => scrollToTarget(findSection("skill")) },
            { title: "Music", icon: "fa-music", action: () => scrollToTarget(findSection("music")) },
            { title: "Contact", icon: "fa-paper-plane", action: () => scrollToTarget(findSection("contact")) },
            { title: "Scroll to top", icon: "fa-arrow-up", action: () => window.scrollTo({top: 0, behavior: "smooth"}) },
            { title: "Toggle music", icon: "fa-play", action: () => q("#musicToggle, #muteBtn, [data-music-toggle]")?.click() },
            { title: "Open Admin", icon: "fa-sliders", action: () => q("#adminLauncher")?.click() }
        ];

        let selected = 0;

        const render = () => {
            const term = input.value.trim().toLowerCase();
            const filtered = commands.filter(c => c.title.toLowerCase().includes(term));
            results.innerHTML = filtered.map((c, i) => `
                <button class="site-command-item ${i === selected ? "active" : ""}" data-command-index="${i}">
                    <span class="site-command-icon"><i class="fa-solid ${c.icon}"></i></span>
                    <span>${c.title}</span>
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            `).join("") || `<div class="site-command-empty">No command found</div>`;

            qa(".site-command-item", results).forEach(btn => {
                btn.addEventListener("click", () => {
                    const item = filtered[Number(btn.dataset.commandIndex)];
                    if (!item) return;
                    close();
                    item.action();
                });
            });
        };

        const open = () => {
            palette.classList.add("is-open");
            palette.setAttribute("aria-hidden", "false");
            input.value = "";
            selected = 0;
            render();
            setTimeout(() => input.focus(), 20);
        };

        const close = () => {
            palette.classList.remove("is-open");
            palette.setAttribute("aria-hidden", "true");
        };

        input.addEventListener("input", () => { selected = 0; render(); });
        input.addEventListener("keydown", (e) => {
            const items = qa(".site-command-item", results);
            if (e.key === "ArrowDown") { e.preventDefault(); selected = Math.min(selected + 1, items.length - 1); render(); }
            if (e.key === "ArrowUp") { e.preventDefault(); selected = Math.max(selected - 1, 0); render(); }
            if (e.key === "Enter") { e.preventDefault(); items[selected]?.click(); }
        });

        q("[data-command-close]", palette)?.addEventListener("click", close);
        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                palette.classList.contains("is-open") ? close() : open();
            }
            if (e.key === "Escape") close();
        });

        // Optional visible launcher via "/" key on desktop; never hijacks typing.
        document.addEventListener("keydown", (e) => {
            if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
                e.preventDefault();
                open();
            }
        });
    }

    function setupScrollProgress() {
        const bar = q("#siteScrollProgress");
        if (!bar) return;
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        };
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        update();
    }

    function setupMobileDock() {
        const dock = q("#mobileDock");
        if (!dock) return;

        const actions = {
            home: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            projects: () => scrollToTarget(findSection("project")),
            music: () => scrollToTarget(findSection("music")),
            top: () => window.scrollTo({ top: 0, behavior: "smooth" })
        };

        qa("[data-dock-action]", dock).forEach(btn => {
            btn.addEventListener("click", () => actions[btn.dataset.dockAction]?.());
        });

        // Hide dock while scrolling down, reveal while scrolling up.
        let lastY = window.scrollY;
        window.addEventListener("scroll", () => {
            const y = window.scrollY;
            dock.classList.toggle("dock-hidden", y > lastY && y > 100);
            lastY = y;
        }, { passive: true });
    }

    function setupOfflineIndicator() {
        const badge = q("#siteOfflineBadge");
        if (!badge) return;

        const update = () => {
            const offline = !navigator.onLine;
            badge.hidden = !offline;
            document.documentElement.dataset.connection = offline ? "offline" : "online";
        };

        window.addEventListener("online", update);
        window.addEventListener("offline", update);
        update();
    }

    function setupTouchFriendlyCards() {
        // Prevent 3D tilt from making touch devices jittery.
        const touch = matchMedia("(hover: none), (pointer: coarse)").matches;
        if (!touch) return;

        document.documentElement.classList.add("touch-device");
        qa("[data-tilt], .tilt-card, .card-3d").forEach(el => {
            el.style.transform = "none";
            el.addEventListener("touchstart", () => el.classList.add("touch-active"), {passive:true});
            el.addEventListener("touchend", () => el.classList.remove("touch-active"), {passive:true});
        });
    }

    function setupExternalLinksSafety() {
        qa('a[target="_blank"]').forEach(a => {
            const rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
            if (!rel.includes("noopener")) rel.push("noopener");
            if (!rel.includes("noreferrer")) rel.push("noreferrer");
            a.setAttribute("rel", rel.join(" "));
        });
    }

    function setupKeyboardFocus() {
        document.addEventListener("keydown", e => {
            if (e.key === "Tab") document.documentElement.classList.add("keyboard-user");
        });
        document.addEventListener("pointerdown", () => document.documentElement.classList.remove("keyboard-user"), {passive:true});
    }

    document.addEventListener("DOMContentLoaded", () => {
        setupCommandPalette();
        setupScrollProgress();
        setupMobileDock();
        setupOfflineIndicator();
        setupTouchFriendlyCards();
        setupExternalLinksSafety();
        setupKeyboardFocus();
    });
})();
