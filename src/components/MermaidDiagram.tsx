import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false })

let renderCount = 0

export default function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState('')

  useEffect(() => {
    const id = `mermaid-${renderCount++}`
    mermaid.render(id, chart).then((result) => {
      setSvg(result.svg)
    })
  }, [chart])

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} />
}
