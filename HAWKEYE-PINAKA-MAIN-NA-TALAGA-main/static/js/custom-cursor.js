(function () {
    const customCursor = document.getElementById("customCursor");
    if (!customCursor) return;

    document.addEventListener("pointermove", function (event) {
        customCursor.style.left = event.clientX + "px";
        customCursor.style.top = event.clientY + "px";
        customCursor.style.opacity = "1";
    });

    document.addEventListener("pointerleave", function () {
        customCursor.style.opacity = "0";
    });
})();
