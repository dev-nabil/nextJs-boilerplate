'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Eye, Info } from 'lucide-react'
interface ISubCategory {
  id?: string
  name: string
}

interface ViewSubcategoriesDialogProps {
  categoryName: string
  subcategories: ISubCategory[]
}

export function ViewSubcategoriesDialog({ categoryName, subcategories }: ViewSubcategoriesDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`View subcategories for ${categoryName}`}>
          <Eye className="h-4 w-4 text-teal-600" />
          <span className="sr-only">View subcategories for {categoryName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subcategories for: {categoryName}</DialogTitle>
          <DialogDescription>A list of all subcategories under {categoryName}.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-2 h-[300px] w-full pr-3">
          {' '}
          {/* Added pr-3 for scrollbar spacing */}
          {subcategories && subcategories.length > 0 ? (
            <ul className="space-y-2">
              {subcategories.map(sub => (
                <li
                  key={sub.id}
                  className="bg-card hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 shadow-sm transition-colors"
                >
                  <span className="text-card-foreground text-sm font-medium">{sub.name}</span>
                  {/* You could add more details or actions for each subcategory here */}
                  {/* e.g., <Badge variant="outline">{sub.productCount} products</Badge> */}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <Info className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground">No subcategories found for {categoryName}.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
