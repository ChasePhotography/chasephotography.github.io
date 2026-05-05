# Still Horizon Photography Portfolio

A complete static photography portfolio website ready for GitHub Pages. It uses only HTML, CSS, JavaScript, and local image assets.

## File Structure

```text
/
+-- index.html
+-- about.html
+-- galleries/
|   +-- index.html
|   +-- mountains.html
|   +-- forests.html
|   +-- coastlines.html
|   +-- wildlife.html
|   +-- panoramas.html
+-- assets/
    +-- css/styles.css
    +-- js/gallery.js
    +-- images/
```

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files and folders from this project to the repository root.
3. In GitHub, open **Settings** > **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)` folder.
6. Save. GitHub will publish the site at `https://your-username.github.io/your-repository/`.

## Add Images

1. Drop gallery images into the matching folder, for example:
   - `assets/images/mountains/`
   - `assets/images/forests/`
   - `assets/images/coastlines/`
   - `assets/images/wildlife/`
   - `assets/images/panoramas/`
2. Use preview images for faster loading if you have them, such as `alpine-basin-preview.jpg`.
3. Keep full-resolution images in the same folder or in a `full/` subfolder.
4. Open the matching gallery HTML file and update `window.PORTFOLIO_GALLERY`.

Example:

```html
{ 
  title: "Alpine Basin",
  src: "../assets/images/mountains/alpine-basin-preview.jpg",
  full: "../assets/images/mountains/alpine-basin-full.jpg",
  description: "Layered alpine ridges at first light.",
  alt: "Alpine basin with layered mountain ridges"
}
```

## Create a New Gallery

1. Copy one existing page in `galleries/`, such as `mountains.html`.
2. Rename it, for example `deserts.html`.
3. Update the page title, heading, intro text, and `window.PORTFOLIO_GALLERY` image list.
4. Add a link to the new page in `galleries/index.html`.

## Panorama Notes

Very wide images are detected automatically in `assets/js/gallery.js`. Images with a wide aspect ratio are displayed full-width, and on smaller screens the panorama frame allows horizontal scrolling.

## Lightbox Controls

- Click any image to open the lightbox.
- Use the previous and next buttons, or keyboard arrow keys, to navigate.
- Use `+`, `-`, mouse wheel, or the zoom buttons to zoom.
- Drag the image to pan.
- Press `Esc` to close.

## Custom Domain

1. Buy or configure a domain with your DNS provider.
2. In GitHub Pages settings, add your domain under **Custom domain**.
3. Add a `CNAME` DNS record pointing to `your-username.github.io`.
4. Optionally add a `CNAME` file at the project root containing only your domain, for example:

```text
www.example.com
```

## Replacing the Placeholder Artwork

The included SVG files are deployable placeholders. Replace them with your own `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, or `.svg` files. The layout preserves original aspect ratios and does not force gallery images into cropped tiles on individual gallery pages.
