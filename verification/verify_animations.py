from playwright.sync_api import sync_playwright, expect

def verify_service_cards(page):
    page.goto("file:////app/index.html")

    # Scroll to services section to trigger animation
    services_section = page.locator("#services-id")
    services_section.scroll_into_view_if_needed()

    # Wait for animation to potentially complete (or catch it mid-flight)
    page.wait_for_timeout(1000)

    # Check if service cards are visible
    cards = page.locator(".service-card")
    expect(cards.first).to_be_visible()

    # Hover over the first card to trigger tilt
    cards.first.hover()
    page.wait_for_timeout(500)

    # Take screenshot
    page.screenshot(path="verification/services_animation.png")

    # Check console for errors
    print("Page title:", page.title())

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        try:
            verify_service_cards(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
