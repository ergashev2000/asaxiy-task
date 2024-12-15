import React, { useState, useEffect } from "react";
import { Container, Nav, Tab } from "react-bootstrap";
import CurrencyConverter from "./components/CurrencyConverter/CurrencyConverter.tsx";
import TransactionManager from "./components/TransactionManager/TransactionManager.tsx";
import Dashboard from "./components/Dashboard/Dashboard.tsx";
import { Transaction } from "./types/index.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API_KEY = "aac7820d3c559807bc7d773a";
// const API_KEY = process.env.REACT_APP_API_KEY as string;

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
      setFilteredTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const handleTransactionAdd = (transaction: Transaction) => {
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    setFilteredTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  const handleFilter = (
    startDate: string,
    endDate: string,
    category?: string
  ) => {
    let filtered = [...transactions];

    if (startDate) {
      filtered = filtered.filter((t) => t.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((t) => t.date <= endDate);
    }
    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }

    setFilteredTransactions(filtered);
  };

  return (
    <div className="App">
      <Container className="py-4">
        <h1 className="text-center mb-4">Personal Finance Manager</h1>

        <Tab.Container defaultActiveKey="dashboard">
          <Nav variant="pills" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="transactions">Transactions</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="converter">Currency Converter</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="dashboard">
              <Dashboard transactions={filteredTransactions} />
            </Tab.Pane>
            <Tab.Pane eventKey="transactions">
              <TransactionManager
                transactions={filteredTransactions}
                onTransactionAdd={handleTransactionAdd}
                onFilter={handleFilter}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="converter">
              <CurrencyConverter apiKey={API_KEY} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
}

export default App;
