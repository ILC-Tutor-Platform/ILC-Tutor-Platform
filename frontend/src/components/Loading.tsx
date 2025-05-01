import { Loader2 } from "lucide-react"
import Logo from "@/assets/AralLinkLogo.svg"

export default function SessionLoading() {
  return (
    <div className="flex mt-36 h-screen md:items-center md:mt-0 justify-center bg-white">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <img src={Logo} alt="AralLink Logo" className="w-56" />
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm text-gray-500">Getting your data. Please wait ...</p>
          </div>
        </div>
      </div>
    </div>
  )
}