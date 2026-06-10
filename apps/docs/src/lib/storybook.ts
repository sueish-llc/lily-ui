// Storybook is published one level under the brand site, at <base>/storybook/.
// Build a deep link to a component's autodocs page: Storybook derives the page
// id by running the story title through its id sanitiser and suffixing --docs
// (e.g. 'Data Display/Avatar' → data-display-avatar--docs).
export function storybookDocsHref(storyTitle: string): string {
  const id = storyTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${import.meta.env.BASE_URL}storybook/?path=/docs/${id}--docs`;
}
