import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    ["Services", "#services"],
    ["Destinations", "#destinations"],
    ["Eligibility", "#eligibility"],
    ["About", "#about"],
    ["Process", "#process"],
    ["Contact", "#contact"],
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="page-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <a
            className="brand"
            href="#top"
            onClick={closeMenu}
            style={{ textDecoration: "none" }}
          >
            <span className="brand-mark">
              <span>D</span>
              <i />
              <span>D</span>
            </span>

            <span className="brand-copy">
              <strong>Dreams To</strong>
              <small>Destination</small>
            </span>
          </a>

          <nav
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
            className="desktop-nav"
          >
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                {label}
              </a>
            ))}

            <a
              className="primary-button primary-button--gold"
              href="#consultation"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Start your journey
              <ArrowRight size={16} />
            </a>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "transparent",
              border: 0,
              color: "inherit",
              cursor: "pointer",
            }}
            className="mobile-menu-button"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {menuOpen && (
          <nav
            aria-label="Mobile navigation"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "20px 0",
            }}
          >
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={closeMenu}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}

            <a
              className="primary-button primary-button--gold"
              href="#consultation"
              onClick={closeMenu}
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                width: "fit-content",
              }}
            >
              Start your journey
              <ArrowRight size={16} />
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}