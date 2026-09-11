const config = {
    // =========================
    // ADMIN / CUSTOMIZATION
    // =========================
    admin: {
        enabled: true,
        // Change this passcode before publishing.
        // NOTE: On a static site this is a UI lock, not server-side security.
        passcode: "CHANGE-ME-1234",
        shortcut: "Ctrl+Shift+A"
    },


    // =========================
    // PROFILE
    // =========================
    profile: {
        name: "Khánh Nguyễn",
        username: "Kian.9",
        avatar: "assets/avatar.png",
        decoration: "assets/decoration.png",

        verified: true,
        status: "Online",
        statusText: "Building something cool",
        location: "Vietnam",
        availability: "Available for interesting projects",
        tagline: "Developer • Discord Bot • Automation",

        bio: [
            "👋 Xin chào, mình là Khánh.",
            "💻 Developer & Discord Bot Developer",
            "🚀 Building cool things with code.",
            "🎮 Discord • Minecraft • Automation"
        ],

        quote: "Code. Create. Repeat.",
        stats: {
            projects: "10+",
            experience: "Building",
            focus: "Automation"
        }
    },

    // =========================
    // DISCORD
    // =========================
    discord: {
        username: "trongkhanh49",
        id: "YOUR_DISCORD_ID",
        invite: "https://discord.com/"
    },

    // =========================
    // SOCIAL
    // =========================
    social: [
        {
            name: "GitHub",
            username: "@trongkhanh49",
            url: "https://github.com/trongkhanh49",
            icon: "fa-brands fa-github",
            color: "#ffffff"
        },
        {
            name: "Facebook",
            username: "Trọng Khánh",
            url: "https://www.facebook.com/share/1EjxQoYBBs/",
            icon: "fa-brands fa-facebook",
            color: "#1877f2"
        },
        {
            name: "Discord",
            username: "kian.9",
            url: "https://discord.gg/RapgnUBb4a",
            icon: "fa-brands fa-discord",
            color: "#5865f2"
        },
        {
            name: "Zalo",
            username: "Khánh Nguyễn",
            url: "https://zalo.me/0798831002",
            icon: "fa-solid fa-comment-dots",
            color: "#0084ff"
        },
        {
            name: "TikTok",
            username: "Rip_TrongKhanh",
            url: "https://www.tiktok.com/@ntk49991?_r=1&_t=ZS-99ZtWD3e7H6",
            icon: "fa-brands fa-tiktok",
            color: "#ffffff"
        },
        {
            name: "YouTube",
            username: "@trongkhanh49",
            url: "https://youtube.com/",
            icon: "fa-brands fa-youtube",
            color: "#ff0033"
        }
    ],

    // =========================
    // SKILLS
    // =========================
    skills: [
        {
            name: "Python",
            icon: "fa-brands fa-python",
            level: 92
        },
        {
            name: "JavaScript",
            icon: "fa-brands fa-js",
            level: 86
        },
        {
            name: "HTML",
            icon: "fa-brands fa-html5",
            level: 95
        },
        {
            name: "CSS",
            icon: "fa-brands fa-css3-alt",
            level: 90
        },
        {
            name: "Discord.py",
            icon: "fa-brands fa-discord",
            level: 94
        },
        {
            name: "Git",
            icon: "fa-brands fa-git-alt",
            level: 82
        }
    ],

    // =========================
    // PROJECTS
    // =========================
    projects: [
        {
            name: "CheckStatsKingMC",
            description:
                "Discord bot hỗ trợ kiểm tra và quản lý thông tin Minecraft.",
            language: "Python",
            icon: "🤖",
            stars: 0,
            forks: 0,
            url: "https://github.com/trongkhanh49/CheckStatsKingMC"
        },
        {
            name: "Discord Bot",
            description:
                "Bot Discord với nhiều tính năng quản lý, tiện ích và automation.",
            language: "Python",
            icon: "⚡",
            stars: 0,
            forks: 0,
            url: "https://github.com/trongkhanh49"
        },
        {
            name: "Profile Website",
            description:
                "Personal developer profile với giao diện animation.",
            language: "JavaScript",
            icon: "🌐",
            stars: 0,
            forks: 0,
            url: "https://github.com/trongkhanh49"
        }
    ],

    // =========================
    // TERMINAL
    // =========================
    terminal: [
        "$ whoami",
        "trongkhanh49",
        "",
        "$ skills --list",
        "Python • JavaScript • Discord.py • Git",
        "",
        "$ status",
        "Online • Building something cool",
        "",
        "$ echo \"Hello World!\"",
        "Hello World! 👋"
    ],

    // =========================
    // MUSIC
    // =========================
    music: {
        enabled: true,

        // "file" = dùng assets/music.mp3
        // "synth" = tạo nhạc ambient bằng Web Audio
        mode: "synth",

        title: "My Favorite Song",
        artist: "Khánh Nguyễn",
        cover: "assets/music-cover.jpg",
        file: "assets/music.mp3",

        volume: 0.55,
        loop: true
    },

    // =========================
    // BACKGROUND
    // =========================
    backgrounds: [
        {
            name: "Aurora",
            background:
                "radial-gradient(circle at 20% 20%, rgba(124,58,237,.28), transparent 35%), radial-gradient(circle at 80% 30%, rgba(6,182,212,.22), transparent 35%), linear-gradient(135deg,#030014,#08051c,#00131a)"
        },
        {
            name: "Purple",
            background:
                "radial-gradient(circle at 30% 20%, rgba(168,85,247,.35), transparent 35%), radial-gradient(circle at 80% 80%, rgba(236,72,153,.2), transparent 35%), linear-gradient(135deg,#080014,#180027,#030014)"
        },
        {
            name: "Ocean",
            background:
                "radial-gradient(circle at 20% 30%, rgba(14,165,233,.3), transparent 35%), radial-gradient(circle at 80% 70%, rgba(20,184,166,.2), transparent 35%), linear-gradient(135deg,#001018,#001c2b,#020617)"
        },
        {
            name: "Midnight",
            background:
                "radial-gradient(circle at 50% 20%, rgba(99,102,241,.25), transparent 40%), linear-gradient(135deg,#020205,#050510,#000)"
        }
    ],

    // =========================
    // EFFECTS
    // =========================
    effects: {
        particles: true,
        cursorGlow: true,
        card3D: true,
        scrollReveal: true,
        typing: true
    }
};