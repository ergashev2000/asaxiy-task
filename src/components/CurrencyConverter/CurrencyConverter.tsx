import React, { useState, useEffect } from "react";
import { Form, Card, Alert, Table } from "react-bootstrap";
import { motion } from "framer-motion";

interface CurrencyConverterProps {
  apiKey: string;
}

const currencies = ["USD", "EUR", "UZS", "RUB"] as const;
type Currency = (typeof currencies)[number];

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ apiKey }) => {
  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD");
  const [toCurrency, setToCurrency] = useState<Currency>("UZS");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
      );
      const data = await response.json();

      if (data.result === "success") {
        setRates(data.conversion_rates);
        setLastUpdate(new Date().toLocaleTimeString());
        setError(null);
      } else {
        setError("Failed to fetch exchange rates");
      }
    } catch (err) {
      setError("Error fetching exchange rates");
    }
  };

  const handleConvert = () => {
    if (!amount || isNaN(Number(amount))) {
      setError("Please enter a valid amount");
      return;
    }

    const baseAmount = Number(amount);
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (fromRate && toRate) {
      const convertedAmount = (baseAmount / fromRate) * toRate;
      setResult(convertedAmount);
      setError(null);
    }
  };

  useEffect(() => {
    if (amount) {
      handleConvert();
    }
  }, [amount, fromCurrency, toCurrency]);

  const formatCurrency = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="mb-0">Currency Converter</h4>
      </Card.Header>
      <Card.Body>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h5>Live Exchange Rates</h5>
          <p className="text-muted small">Last updated: {lastUpdate}</p>
          <Table striped hover size="sm" className="mb-4">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Rate (USD)</th>
              </tr>
            </thead>
            <tbody>
              {currencies
                .filter((curr) => curr !== "USD")
                .map((currency) => (
                  <motion.tr
                    key={currency}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{currency}</td>
                    <td>{rates[currency]?.toFixed(4)}</td>
                  </motion.tr>
                ))}
            </tbody>
          </Table>
        </motion.div>

        <Form>
          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>From</Form.Label>
                <Form.Select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as Currency)}
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>To</Form.Label>
                <Form.Select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as Currency)}
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4 bg-light rounded"
            >
              <h3 className="mb-0">
                {formatCurrency(Number(amount), fromCurrency)} ={" "}
                {formatCurrency(result, toCurrency)}
              </h3>
            </motion.div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CurrencyConverter;
