import { Paper, Typography } from '@mui/material'
import MermaidDiagram from '../components/MermaidDiagram'

const authFlowChart = `
graph TD
    A["main.tsx AuthProviderで全体を包む"] --> B["App.tsx ルーティング定義"]
    B --> C{"/login"}
    B --> D["/ (Home)"]
    B --> E["/about"]

    D --> F["ProtectedRoute で保護"]
    E --> F
    F --> G{isAuthenticated?}
    G -- "false" --> C
    G -- "true" --> H["ページを表示"]

    C --> I["Login.tsx ユーザー名を入力"]
    I -- "ログインボタン" --> J["useAuth().login() AuthContextの状態を更新"]
    J --> K["isAuthenticated が true になる"]
    K --> D
`

export default function Home() {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        さよなら
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          認証フロー図
        </Typography>
        <MermaidDiagram chart={authFlowChart} />
      </Paper>
    </>
  )
}
