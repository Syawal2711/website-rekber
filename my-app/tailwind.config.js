const flowbite = require('flowbite-react/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    flowbite.content(),  // Ensure Flowbite content paths are correctly configured
  ],
  plugins: [
    // Add Flowbite plugin
    flowbite.plugin(),
  ],
  // Prefix for Tailwind classes
};
