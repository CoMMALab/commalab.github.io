$(document).ready(function () {
  // add toggle functionality to abstract, award and bibtex buttons
  $("a.abstract").click(function () {
    $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.award").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});

// Videos carry their URL in data-src so nothing downloads until it scrolls near
// the viewport; posters render immediately in the meantime. Autoplay videos only
// play while near the viewport, and are restarted when the tab becomes visible
// again since browsers pause or suspend media in background tabs.
document.addEventListener("DOMContentLoaded", () => {
  const visible = new Set();
  const play = (v) => v.play().catch(() => {});
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ isIntersecting, target: v }) => {
        if (isIntersecting) {
          if (v.dataset.src) {
            v.src = v.dataset.src;
            delete v.dataset.src;
          }
          visible.add(v);
          if (v.autoplay) play(v);
        } else {
          visible.delete(v);
          if (v.autoplay) v.pause();
        }
      });
    },
    { rootMargin: "300px" }
  );
  document.querySelectorAll("video[data-src]").forEach((v) => {
    observer.observe(v);
    v.addEventListener(
      "error",
      () => {
        v.load();
        if (v.autoplay) play(v);
      },
      { once: true }
    );
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    visible.forEach((v) => v.autoplay && v.paused && play(v));
  });
});
