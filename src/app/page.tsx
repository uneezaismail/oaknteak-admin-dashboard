import LoginForm from "@/components/form/LoginForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-custom-green mb-8 text-center">Admin Dashboard</h1>
        <LoginForm />
      </div>
    </main>
  )
}

