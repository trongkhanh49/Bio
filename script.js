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