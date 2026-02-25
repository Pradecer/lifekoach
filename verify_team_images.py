from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8080/index.html")

        # Wait for the team section to be visible
        page.wait_for_selector("#team")

        # Scroll to the team section
        team_section = page.locator("#team")
        team_section.scroll_into_view_if_needed()

        # Wait a bit for images to load
        page.wait_for_timeout(2000)

        # Take a screenshot of the team section
        team_section.screenshot(path="verification_team.png")

        browser.close()

if __name__ == "__main__":
    run()
