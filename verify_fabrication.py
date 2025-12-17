from playwright.sync_api import sync_playwright

def verify_fabrication_certs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the file
        import os
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/services/fabrication.html")

        # Wait for AOS or content to load
        page.wait_for_timeout(2000)

        # Scroll to hero
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/fabrication_hero.png")

        # Scroll to the second cert
        cert_section = page.locator(".cert-display")
        cert_section.scroll_into_view_if_needed()
        page.wait_for_timeout(2000) # Wait for animation
        page.screenshot(path="/home/jules/verification/fabrication_body_cert.png")

        browser.close()

if __name__ == "__main__":
    verify_fabrication_certs()
