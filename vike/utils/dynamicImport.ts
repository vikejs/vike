/** Only works for npm packages, for files use @brillout/import instead */
export function dynamicImport<Mod = never>(mod: string): Promise<Mod> {
  return new Function('mod', 'return import(mod)')(mod)
}
