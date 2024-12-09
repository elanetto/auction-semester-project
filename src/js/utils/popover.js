export const popover = () => {
    document.addEventListener("DOMContentLoaded", () => {
        const button = document.getElementById("popover-button");
        const popover = document.getElementById("my-popover");
      
        button.addEventListener("click", () => {
          const isVisible = popover.classList.contains("hidden");
      
          // Toggle visibility
          popover.classList.toggle("hidden", !isVisible);
          button.setAttribute("aria-expanded", isVisible ? "false" : "true");
      
          // Position the popover below the button
          const buttonRect = button.getBoundingClientRect();
          popover.style.top = `${buttonRect.bottom + window.scrollY}px`;
          popover.style.left = `${buttonRect.left}px`;
        });
      
        // Close the popover when clicking outside
        document.addEventListener("click", (event) => {
          if (!button.contains(event.target) && !popover.contains(event.target)) {
            popover.classList.add("hidden");
            button.setAttribute("aria-expanded", "false");
          }
        });
    });      
};