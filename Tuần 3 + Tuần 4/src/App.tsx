import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductList } from "./components/ProductList";
import { ProductListRTKQuery } from "./components/ProductListRTKQuery";
import { Cart } from "./components/Cart";
import { Favorites } from "./components/Favorites";

type DataSource = "thunk" | "rtk-query";

function App() {
  const [source, setSource] = useState<DataSource>("thunk");

  return (
    <div className="mx-auto px-4 py-4 max-w-6xl">
      <header className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="font-semibold text-xl tracking-tight">Shopping Cart</h1>
        <div className="inline-flex p-1 border rounded-md">
          <Button
            size="sm"
            variant={source === "thunk" ? "default" : "ghost"}
            onClick={() => setSource("thunk")}
          >
            createAsyncThunk
          </Button>
          <Button
            size="sm"
            variant={source === "rtk-query" ? "default" : "ghost"}
            onClick={() => setSource("rtk-query")}
          >
            RTK Query
          </Button>
        </div>
      </header>

      <Separator className="mb-6" />

      <main className="gap-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <section className="min-w-0">
          <h2 className="mb-4 font-medium text-lg">Sản phẩm</h2>
          {source === "thunk" ? <ProductList /> : <ProductListRTKQuery />}
        </section>

        <aside className="min-w-0">
          <div className="space-y-6">
            <Favorites />
            <Cart />
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
