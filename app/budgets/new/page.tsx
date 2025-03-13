import { BudgetForm } from "@/components/budget-form"

export default function NewBudgetPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create Budget</h1>

      <div className="max-w-2xl mx-auto">
        <BudgetForm />
      </div>
    </div>
  )
}

