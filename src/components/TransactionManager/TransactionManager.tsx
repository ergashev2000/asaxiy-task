import React, { useState, useEffect } from "react";
import { Form, Button, Card, Table, Badge } from "react-bootstrap";
import { Transaction, TransactionCategory } from "../../types/index.ts";

interface TransactionManagerProps {
  onTransactionAdd: (transaction: Transaction) => void;
  transactions: Transaction[];
  onFilter: (startDate: string, endDate: string, category?: string) => void;
}

const categories: TransactionCategory[] = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Other",
];

const TransactionManager: React.FC<TransactionManagerProps> = ({
  onTransactionAdd,
  transactions,
  onFilter,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<TransactionCategory>("Other");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount))) {
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      amount: Number(amount),
      category,
      type,
      date,
      note,
      timestamp: new Date().getTime(),
    };

    onTransactionAdd(newTransaction);
    setAmount("");
    setNote("");
  };

  const resetFilters = () => {
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterCategory("");
  };

  useEffect(() => {
    if (filterStartDate || filterEndDate) {
      onFilter(filterStartDate, filterEndDate, filterCategory);
    }
  }, [filterStartDate, filterEndDate, filterCategory]);

  return (
    <div className="mb-4">
      <Card className="mb-4">
        <Card.Header>
          <h4>Add Transaction</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as TransactionCategory)
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as "income" | "expense")
                    }
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note about the transaction"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Transaction
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Transactions</h4>
          <Button variant="outline-secondary" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Card.Body>
        <Card.Body>
          <div className="table-responsive">
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>
                      <Badge
                        bg={
                          transaction.type === "income" ? "success" : "danger"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </td>
                    <td>{transaction.category}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{transaction.note}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr className="text-center m-4">
                    <td colSpan={5}>No transactions found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TransactionManager;
