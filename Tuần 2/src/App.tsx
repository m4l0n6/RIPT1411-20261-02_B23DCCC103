import Accordion from './components/Accordion/Accordion'
import usePagination from "./hooks/usePagination";

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "iPhone 15", price: 20000000 },
  { id: 2, name: "Samsung S24", price: 18000000 },
  { id: 3, name: "MacBook Air", price: 25000000 },
  { id: 4, name: "Dell XPS", price: 22000000 },
  { id: 5, name: "iPad Pro", price: 21000000 },
  { id: 6, name: "AirPods Pro", price: 6000000 },
  { id: 7, name: "Apple Watch", price: 9000000 },
  { id: 8, name: "Logitech Mouse", price: 1000000 },
  { id: 9, name: "Mechanical Keyboard", price: 2500000 },
  { id: 10, name: "Monitor", price: 5000000 },
];

function App() {
  
 const { currentPage, totalPages, currentData, next, prev, goToPage } =
   usePagination(products, 3);
  return (
    <>
      <div>
        <h1>Accordion</h1>

        <Accordion defaultValue="panel1">
          <Accordion.Item value="panel1">
            <Accordion.Trigger value="panel1">Panel 1</Accordion.Trigger>

            <Accordion.Content value="panel1">
              Đây là nội dung của Panel 1.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="panel2">
            <Accordion.Trigger value="panel2">Panel 2</Accordion.Trigger>

            <Accordion.Content value="panel2">
              Đây là nội dung của Panel 2.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="panel3">
            <Accordion.Trigger value="panel3">Panel 3</Accordion.Trigger>

            <Accordion.Content value="panel3">
              Đây là nội dung của Panel 3.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      <div>
        <h1>Product List</h1>

        {currentData.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.price.toLocaleString()} VNĐ</p>
          </div>
        ))}

        <div>
          <button onClick={prev}>Previous</button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => goToPage(index + 1)}>
              {index + 1}
            </button>
          ))}

          <button onClick={next}>Next</button>
        </div>

        <p>
          Page {currentPage} / {totalPages}
        </p>
      </div>
    </>
  );
}

export default App
