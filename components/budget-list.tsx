// import Link from "next/link"
// import { format } from "date-fns"
// import { getBudgets, getBudgetProgress } from "@/lib/data"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"

// export async function BudgetList() {
//   const budgets = await getBudgets()

//   if (budgets.length === 0) {
//     return (
//       <div className="text-center p-8 border rounded-lg">
//         <p className="text-muted-foreground mb-4">No budgets found. Create a budget to start tracking your spending.</p>
//         <Button asChild>
//           <Link href="/budgets/new">Create Budget</Link>
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {
//         await Promise.all(
//           budgets.map(async (budget: any) => {
//             const progress = await getBudgetProgress(budget._id.toString())
//             const isOverBudget = progress.percentage >= 100

//             return (
//               <Card key={budget._id.toString()}>
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-start">
//                     <CardTitle className="text-xl">{budget.name}</CardTitle>
//                     {budget.category && (
//                       <Badge variant="outline" className="capitalize">
//                         {budget.category}
//                       </Badge>
//                     )}
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     {format(new Date(budget.startDate), "MMM d")} - {format(new Date(budget.endDate), "MMM d, yyyy")}
//                   </p>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium">
//                         ${progress.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
//                       </span>
//                       <span
//                         className={`text-sm font-medium ${isOverBudget ? "text-destructive" : "text-muted-foreground"}`}
//                       >
//                         {progress.percentage.toFixed(0)}%
//                       </span>
//                     </div>
//                     <Progress
//                       value={progress.percentage}
//                       className={isOverBudget ? "bg-destructive/20" : ""}
//                       indicatorClassName={isOverBudget ? "bg-destructive" : ""}
//                     />
//                     <div className="flex justify-between items-center text-sm">
//                       <span className={isOverBudget ? "text-destructive" : "text-emerald-500"}>
//                         {isOverBudget
//                           ? `$${(progress.spent - budget.amount).toFixed(2)} over budget`
//                           : `$${progress.remaining.toFixed(2)} remaining`}
//                       </span>
//                     </div>
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button asChild variant="outline" className="w-full">
//                     <Link href={`/budgets/${budget._id.toString()}`}>View Details</Link>
//                   </Button>
//                 </CardFooter>
//               </Card>
//             )
//           }),
//         )
//       }
//     </div>
//   )
// }
import Link from "next/link";
import { format } from "date-fns";
import { getBudgets, getBudgetProgress } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { use } from "react"; // ✅ Use this for async calls in Next.js 14+

export function BudgetList() {
  const budgets = use(getBudgets()); // ✅ Fetch budgets here

  if (budgets.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground mb-4">No budgets found. Create a budget to start tracking your spending.</p>
        <Button asChild>
          <Link href="/budgets/new">Create Budget</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map((budget: any) => {
        const progress = use(getBudgetProgress(budget._id.toString())); // ✅ Fetch progress here
        const isOverBudget = progress.percentage >= 100;

        return (
          <Card key={budget._id.toString()}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{budget.name}</CardTitle>
                {budget.category && (
                  <Badge variant="outline" className="capitalize">
                    {budget.category}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(budget.startDate), "MMM d")} - {format(new Date(budget.endDate), "MMM d, yyyy")}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    ${progress.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                  </span>
                  <span className={`text-sm font-medium ${isOverBudget ? "text-destructive" : "text-muted-foreground"}`}>
                    {progress.percentage.toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={progress.percentage}
                  className={isOverBudget ? "bg-destructive/20" : ""}
                  indicatorClassName={isOverBudget ? "bg-destructive" : ""}
                />
                <div className="flex justify-between items-center text-sm">
                  <span className={isOverBudget ? "text-destructive" : "text-emerald-500"}>
                    {isOverBudget
                      ? `$${(progress.spent - budget.amount).toFixed(2)} over budget`
                      : `$${progress.remaining.toFixed(2)} remaining`}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/budgets/${budget._id.toString()}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}


