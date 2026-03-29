(function () {
  // Get script configuration
  const script = document.currentScript;
  const chatbotId = script.getAttribute("data-chatbot-id");
  const origin = new URL(script.src).origin;

  if (!chatbotId) {
    console.error("ChatWidget: data-chatbot-id is missing");
    return;
  }

  // Create iframe container
  const container = document.createElement("div");
  container.id = "chat-widget-container";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "999999";
  container.style.width = "400px";
  container.style.height = "600px";
  container.style.maxHeight = "90vh";
  container.style.maxWidth = "90vw";
  container.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
  container.style.borderRadius = "16px";
  container.style.overflow = "hidden";
  container.style.display = "none"; // Start hidden if we want a custom button,
  // but app/widget/[id] already has a button?
  // Let's check ChatWidget.tsx...
  // Yes, ChatWidget.tsx (line 140) has a floating button.
  // So the iframe should probably be transparent and small initially?
  // Actually, if ChatWidget.tsx handles the button, the iframe
  // needs to be large enough to contain the button AND the chat window.

  // Re-adjusting: if ChatWidget.tsx handles everything, the iframe should be full height/width
  // of the widget area and transparent where there is no content.
  container.style.width = "400px";
  container.style.height = "700px";
  container.style.pointerEvents = "none"; // Pass clicks through by default
  container.style.boxShadow = "none";
  container.style.borderRadius = "0";
  container.style.display = "block";

  const iframe = document.createElement("iframe");
  iframe.src = `${origin}/widget/${chatbotId}`;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.pointerEvents = "auto"; // Re-enable pointer events for the iframe content
  iframe.style.background = "transparent";

  container.appendChild(iframe);
  document.body.appendChild(container);

  // Listen for messages from iframe (e.g. to resize or hide)
  window.addEventListener("message", (event) => {
    if (event.origin !== origin) return;

    if (event.data === "close-chat") {
      // Handle closing if needed
    }
  });
})();
