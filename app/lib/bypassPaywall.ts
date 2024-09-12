export async function bypassPaywall(url: string): Promise<string | null> {
  try {
    const response = await fetch("/api/bypassPaywall", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Failed to bypass paywall");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error bypassing paywall:", error);
    return null;
  }
}
