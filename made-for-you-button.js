(async function madeForYouButton() {
    while (
        !Spicetify?.React ||
        !Spicetify?.ReactDOM ||
        !Spicetify?.ReactComponent?.ButtonTertiary ||
        !Spicetify?.ReactComponent?.TooltipWrapper ||
        !Spicetify?.ReactComponent?.IconComponent ||
        !Spicetify?.Platform?.History
    ) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const { React, ReactDOM, ReactComponent, Platform } = Spicetify;

    const label = "Made For You";
    // Spotify redirects "/made-for-you" here, so it's the path that's actually active on the page.
    // Same target as Spotify's own "Go to Made For You" shortcut (Alt+Shift+M).
    const routePath = "/genre/0JQ5DAt0tbjZptfcdMSKl3";

    const heartPath = "M4.03553 1C1.80677 1 0 2.80677 0 5.03553C0 6.10582 0.42517 7.13228 1.18198 7.88909L7.14645 13.8536C7.34171 14.0488 7.65829 14.0488 7.85355 13.8536L13.818 7.88909C14.5748 7.13228 15 6.10582 15 5.03553C15 2.80677 13.1932 1 10.9645 1C9.89418 1 8.86772 1.42517 8.11091 2.18198L7.5 2.79289L6.88909 2.18198C6.13228 1.42517 5.10582 1 4.03553 1Z";

    // Outline when inactive, filled when active, like the built-in nav links.
    // Both states share the stroke so the icon doesn't change size when toggling.
    const createHeartSvg = (filled) =>
        `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-1 -1 17 17"><path d="${heartPath}" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

    const createIcon = (svg) => () =>
        React.createElement(ReactComponent.IconComponent, {
            iconSize: 24,
            dangerouslySetInnerHTML: { __html: svg },
        });

    const HeartIcon = createIcon(createHeartSvg(false));
    const HeartActiveIcon = createIcon(createHeartSvg(true));

    const isOnRoute = () => Platform.History.location?.pathname?.startsWith(routePath) ?? false;

    // Mirrors the component Spicetify renders for custom app nav links (e.g. Marketplace).
    function MadeForYouNavLink() {
        const [isActive, setIsActive] = React.useState(isOnRoute);

        React.useEffect(() => Platform.History.listen(() => setIsActive(isOnRoute())), []);

        return React.createElement(
            ReactComponent.TooltipWrapper,
            { label },
            React.createElement(ReactComponent.ButtonTertiary, {
                iconOnly: isActive ? HeartActiveIcon : HeartIcon,
                className: Spicetify.classnames(
                    "link-subtle",
                    "main-globalNav-navLink",
                    "main-globalNav-link-icon",
                    "custom-navlink",
                    { "main-globalNav-navLinkActive": isActive }
                ),
                "aria-label": label,
                onClick: () => {
                    if (!isOnRoute()) {
                        Platform.History.push(routePath);
                    }
                },
            })
        );
    }

    const host = document.createElement("div");
    host.style.display = "contents";

    const navLink = React.createElement(MadeForYouNavLink);
    if (ReactDOM.createRoot) {
        ReactDOM.createRoot(host).render(navLink);
    } else {
        ReactDOM.render(navLink, host);
    }

    function ensurePlacement() {
        if (host.isConnected) return;
        const navLinks = document.querySelector('.custom-navlinks-scrollable_container div[role="presentation"]');
        navLinks?.appendChild(host);
    }

    ensurePlacement();
    new MutationObserver(ensurePlacement).observe(document.body, { childList: true, subtree: true });
})();
