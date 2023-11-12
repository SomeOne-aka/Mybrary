const rootStyles = window.getComputedStyle(document.documentElement);

if (rootStyles.getPropertyValue("--book-cover-width-large") != null) {
  ready();
} else {
  document.getElementById("main-css").addEventListener("load", ready);
}

function ready() {
  const coverWidth = rootStyles.getPropertyValue("--book-cover-width-large");
  const coverAspectRatio = rootStyles.getPropertyValue(
    "--book-cover-aspect-ratio"
  );
  const coverHeight = eval(coverWidth / coverAspectRatio);

  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  );

  FilePond.setOptions({
    stylePanelAspectRatio: parseFloat(coverAspectRatio),
    imageResizeTargetWidth: parseFloat(coverWidth),
    imageResizeTargetHeight: parseFloat(coverHeight),
  });

  FilePond.parse(document.body);
}
