document.addEventListener("DOMContentLoaded", function () {
    barba.init({
        transitions: [
            {
                name: "veil-transition",
                async leave(data) {
                    const overlay = document.getElementById("transition-overlay");
                    overlay.style.pointerEvents = "auto";
                    overlay.style.opacity = "1";

                    await new Promise(resolve => setTimeout(resolve, 800));
                },
                async enter(data) {
                    await new Promise(resolve => setTimeout(resolve, 400));
                    const overlay = document.getElementById("transition-overlay");
                    overlay.style.opacity = "0";
                    overlay.style.pointerEvents = "none";
                }
            }
        ]
    });
});
