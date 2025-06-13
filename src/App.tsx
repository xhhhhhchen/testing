// import { useState } from "react"


import Sidebar from "./layout/Sidebar"
import { SidebarProvider } from "./contexts/SidebarContext.tsx"

export default function App() {
  

  return (
    <SidebarProvider>
      <div className="max-h-screen flex flex-col">
        <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
          <Sidebar/>
          
            
      
        </div>
      </div>
    </SidebarProvider>
  )
}