import { Navigate, Route, Routes } from 'react-router-dom'

import { OddsBoardPage } from '@/pages/odds-board/OddsBoardPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OddsBoardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
