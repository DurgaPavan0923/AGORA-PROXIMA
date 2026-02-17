import requests
import textwrap
from datetime import datetime

# -------------------------------------------------------------------
# CONFIGURATION (YOUR API KEY INSERTED HERE)
# -------------------------------------------------------------------
GNEWS_API_KEY = "76a43aab1710f5051446a8b92e21c54a"
GNEWS_ENDPOINT = "https://gnews.io/api/v4/search"


# -------------------------------------------------------------------
# AUTO-DETECT LOCATION
# -------------------------------------------------------------------
def detect_location_by_ip():
    try:
        print("Trying to detect your location automatically...")
        response = requests.get("https://ipinfo.io/json", timeout=5)
        response.raise_for_status()

        data = response.json()
        city = data.get("city")
        region = data.get("region")
        country = data.get("country")

        if city:
            detected = f"{city}, {region}, {country}"
            print(f"Detected location: {detected}")
            return detected

        print("Could not detect location.")
        return None

    except Exception as e:
        print("Location auto-detection failed:", e)
        return None


# -------------------------------------------------------------------
# ASK USER FOR LOCATION
# -------------------------------------------------------------------
def ask_user_for_location():
    print("\nEnter your locality / area / block (Example: Nayapalli, Bhubaneswar):")
    return input("Your location: ").strip()


# -------------------------------------------------------------------
# FETCH NEWS USING GNEWS
# -------------------------------------------------------------------
def fetch_local_news(location, max_results=10):
    print(f"\nSearching for news in: {location} ...")

    params = {
        "q": location,
        "lang": "en",
        "country": "in",
        "max": max_results,
        "apikey": GNEWS_API_KEY
    }

    try:
        response = requests.get(GNEWS_ENDPOINT, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        articles = data.get("articles", [])
        if not articles:
            print("No news found for this location.")
        return articles

    except Exception as e:
        print("\n❌ Error while fetching news:", e)
        print("Check your API key or network connection.")
        return []


# -------------------------------------------------------------------
# PRINT HEADLINES
# -------------------------------------------------------------------
def print_headlines(articles):
    print("\n📢 Latest Local Headlines:\n")
    for idx, article in enumerate(articles, start=1):
        print(f"{idx}. {article.get('title', 'No title')}")
    print()


# -------------------------------------------------------------------
# READ FULL ARTICLE
# -------------------------------------------------------------------
def show_article_details(article):
    print("\n" + "=" * 80)
    print("📰", article.get("title", "No title"))
    print("=" * 80)

    description = article.get("description", "")
    content = article.get("content", "")

    full_text = (description + "\n\n" + content).strip()
    if not full_text:
        full_text = "No detailed content available. Open the link below."

    print(textwrap.fill(full_text, width=80))

    url = article.get("url", "")
    print("\n🔗 Read full article here:", url)
    print("=" * 80 + "\n")


# -------------------------------------------------------------------
# MAIN PROGRAM
# -------------------------------------------------------------------
def main():
    print("==============================================")
    print("     AGORA – Local News Detection System      ")
    print("==============================================\n")

    # 1. Auto-detect location
    location = detect_location_by_ip()

    # 2. Accept or override
    if location:
        print(f"\nUse detected location ({location})?")
        decision = input("Press ENTER to accept or type new location: ").strip()
        if decision:
            location = decision
    else:
        location = ask_user_for_location()

    if not location:
        print("❌ No location entered. Exiting.")
        return

    # 3. Fetch news
    articles = fetch_local_news(location)

    if not articles:
        return

    # 4. News browsing loop
    while True:
        print_headlines(articles)

        print("Choose article number to read")
        print("Enter 'r' to refresh, 'q' to quit")
        choice = input("Your choice: ").strip().lower()

        if choice == "q":
            print("\nThank You! Have a Nice day")
            break
        elif choice == "r":
            articles = fetch_local_news(location)
            if not articles:
                break
        elif choice.isdigit():
            index = int(choice)
            if 1 <= index <= len(articles):
                show_article_details(articles[index - 1])
            else:
                print("❌ Invalid article number.\n")
        else:
            print("❌ Invalid input.\n")


# -------------------------------------------------------------------
# RUN
# -------------------------------------------------------------------
if __name__ == "__main__":
    main()
