const studioAppCategories = [
  {
    label: "AI & Assistants",
    tools: [
      { name: "ChatGPT", icon: "chatgpt" },
      { name: "Codex", icon: "codex" },
      { name: "Grok", icon: "grok" },
      { name: "Tripo", icon: "tripo" },
      { name: "Meshy", icon: "meshy" },
    ],
  },
  {
    label: "Development & Frameworks",
    tools: [
      { name: "VS Code", icon: "vscode" },
      { name: "React", icon: "react" },
      { name: "React Compiler", icon: "react-compiler" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Vite", icon: "vite" },
      { name: "Electron", icon: "electron" },
    ],
  },
  {
    label: "3D, Animation & Games",
    tools: [
      { name: "Unreal Engine", icon: "unreal-engine" },
      { name: "Unity", icon: "unity" },
      { name: "Blender", icon: "blender" },
      { name: "DAZ 3D", icon: "daz-studio" },
    ],
  },
  {
    label: "Photo & Digital Painting",
    tools: [
      { name: "Photoshop", icon: "photoshop" },
      { name: "Lightroom Classic", icon: "lightroom-classic" },
      { name: "Krita", icon: "krita" },
      { name: "Affinity Photo", icon: "affinity-photo" },
    ],
  },
  {
    label: "Design & Publishing",
    tools: [
      { name: "Affinity Designer", icon: "affinity-designer" },
      { name: "Affinity Publisher", icon: "affinity-publisher" },
    ],
  },
] as const;

const officialToolIcons: Record<string, string> = {
  tripo: "https://www.tripo3d.ai/favicon.ico",
  meshy: "https://cdn.meshy.ai/ti_w%3A2048%2Cq%3A75/landing-assets/media-kit/meshy-logo-general.webp",
};

const studioLanguages = [
  { name: "Java", icon: "java" },
  { name: "TypeScript", icon: "typescript" },
  { name: "C", icon: "clang" },
  { name: "C#", icon: "csharp" },
  { name: "C++", icon: "cplusplus" },
] as const;

function toolIconSrc(icon: string) {
  if (officialToolIcons[icon]) return officialToolIcons[icon];
  if (icon === "daz-studio") return "/tech-icons/daz-studio.svg?v=20261107";
  return `/tech-icons/${icon}.svg`;
}

export default function StudioToolLogos() {
  return (
    <div className="studio-tool-grid" aria-label="Software and development tools I use">
      <section className="studio-tool-group studio-tool-group-apps" aria-labelledby="studio-apps-heading">
        <h3 id="studio-apps-heading" className="studio-tool-group-heading">Apps &amp; Tools</h3>
        <div className="studio-tool-subgroups">
          {studioAppCategories.map((category) => (
            <section className="studio-tool-subgroup" key={category.label} aria-label={category.label}>
              <h4 className="studio-tool-subgroup-heading">{category.label}</h4>
              <div className="studio-tool-group-items" role="list">
                {category.tools.map((tool) => (
                  <div className="studio-tool" role="listitem" key={tool.name}>
                    <span className="studio-tool-icon">
                      <img src={toolIconSrc(tool.icon)} alt="" width={36} height={36} loading="lazy" decoding="async" />
                    </span>
                    <span className="studio-tool-label">{tool.name}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="studio-tool-group studio-tool-group-languages" aria-labelledby="studio-languages-heading">
        <h3 id="studio-languages-heading" className="studio-tool-group-heading">Programming Languages</h3>
        <div className="studio-tool-group-items" role="list">
          {studioLanguages.map((tool) => (
            <div className="studio-tool" role="listitem" key={tool.name}>
              <span className="studio-tool-icon">
                <img src={toolIconSrc(tool.icon)} alt="" width={36} height={36} loading="lazy" decoding="async" />
              </span>
              <span className="studio-tool-label">{tool.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
