const studioTools = [
  { name: "ChatGPT", icon: "chatgpt" },
  { name: "Codex", icon: "codex" },
  { name: "VS Code", icon: "vscode" },
  { name: "Unreal Engine", icon: "unreal-engine" },
  { name: "Blender", icon: "blender" },
  { name: "React", icon: "react" },
  { name: "Vite", icon: "vite" },
  { name: "Java", icon: "java" },
  { name: "TypeScript", icon: "typescript" },
  { name: "C++", icon: "cplusplus" },
  { name: "Electron", icon: "electron" },
] as const;

export default function StudioToolLogos() {
  return (
    <div className="studio-tool-grid" role="list" aria-label="Software and development tools I use">
      {studioTools.map((tool) => (
        <div className="studio-tool" role="listitem" key={tool.name}>
          <span className="studio-tool-icon">
            <svg viewBox="0 0 24 24" width="42" height="42" aria-hidden="true" focusable="false">
              <use href={`/tech-icons.svg#${tool.icon}`} width="100%" height="100%" />
            </svg>
          </span>
          <span className="studio-tool-label">{tool.name}</span>
        </div>
      ))}
    </div>
  );
}
