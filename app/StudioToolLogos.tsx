const studioToolGroups = [
  {
    label: "Apps & Tools",
    tools: [
      { name: "ChatGPT", icon: "chatgpt" },
      { name: "Codex", icon: "codex" },
      { name: "VS Code", icon: "vscode" },
      { name: "Unreal Engine", icon: "unreal-engine" },
      { name: "Blender", icon: "blender" },
      { name: "Photoshop", icon: "photoshop" },
      { name: "Lightroom Classic", icon: "lightroom-classic" },
      { name: "Krita", icon: "krita" },
      { name: "Affinity Photo", icon: "affinity-photo" },
      { name: "Affinity Publisher", icon: "affinity-publisher" },
      { name: "Affinity Designer", icon: "affinity-designer" },
      { name: "DAZ Studio", icon: "daz-studio" },
      { name: "React", icon: "react" },
      { name: "React Compiler", icon: "react-compiler" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Vite", icon: "vite" },
      { name: "Electron", icon: "electron" },
    ],
  },
  {
    label: "Languages",
    tools: [
      { name: "Java", icon: "java" },
      { name: "TypeScript", icon: "typescript" },
      { name: "C", icon: "clang" },
      { name: "C#", icon: "csharp" },
      { name: "C++", icon: "cplusplus" },
    ],
  },
] as const;

export default function StudioToolLogos() {
  return (
    <div className="studio-tool-grid" aria-label="Software and development tools I use">
      {studioToolGroups.map((group) => (
        <section className="studio-tool-group" key={group.label} aria-label={group.label}>
          <h3 className="studio-tool-group-heading">{group.label}</h3>
          <div className="studio-tool-group-items" role="list">
            {group.tools.map((tool) => (
              <div className="studio-tool" role="listitem" key={tool.name}>
                <span className="studio-tool-icon">
                  <img src={`/tech-icons/${tool.icon}.svg`} alt="" width={36} height={36} loading="lazy" decoding="async" />
                </span>
                <span className="studio-tool-label">{tool.name}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
