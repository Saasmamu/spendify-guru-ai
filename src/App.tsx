
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { StatementProvider } from "@/contexts/StatementContext"
import { SubscriptionProvider } from "@/contexts/SubscriptionContext"
import { AdminProvider } from "@/contexts/AdminContext"
import { routes } from "@/routes"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <SubscriptionProvider>
              <AdminProvider>
                <StatementProvider>
                  <div className="min-h-screen bg-background font-sans antialiased">
                    <Routes>
                      {routes.map((route) => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={route.element}
                        />
                      ))}
                    </Routes>
                  </div>
                  <Toaster />
                </StatementProvider>
              </AdminProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
