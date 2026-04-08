import { useState } from 'react';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import { Smartphone } from 'lucide-react';

interface PaymentScannerProps {
  bookingId: number;
  amount: number;
  onPaymentSuccess: () => void;
}

export default function PaymentScanner({
  bookingId,
  amount,
  onPaymentSuccess,
}: PaymentScannerProps) {
  const [paymentRef, setPaymentRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const handleSimulateScan = () => {
    // Simulate QR code scan
    setSimulating(true);
    setTimeout(() => {
      const mockReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setPaymentRef(mockReference);
      setSimulating(false);
      toast.success('Payment scanned successfully!');
    }, 2000);
  };

  const handleProcessPayment = async () => {
    if (!paymentRef.trim()) {
      toast.error('Please scan payment first');
      return;
    }

    try {
      setLoading(true);
      await api.provider.processPayment(bookingId.toString(), paymentRef);
      toast.success('✅ Payment received and recorded!');
      onPaymentSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-blue-500 rounded-xl p-6 space-y-4">
      {/* Scanner Animation */}
      <div className="bg-white border-4 border-blue-300 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">📱</div>
        <div className="text-2xl font-bold text-gray-900 mb-4">Payment Scanner</div>
        <div className="text-gray-600 font-semibold mb-6">Hold phone near scanner or tap button below</div>

        {/* Simulated Scanner */}
        <button
          onClick={handleSimulateScan}
          disabled={simulating || !!paymentRef}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg text-lg transition flex items-center justify-center gap-3"
        >
          <Smartphone size={24} />
          {simulating ? '🔄 Scanning...' : paymentRef ? '✅ Payment Scanned' : '📲 Tap to Simulate Scan'}
        </button>
      </div>

      {/* Amount Display */}
      <div className="bg-green-100 border-4 border-green-400 rounded-lg p-4 text-center">
        <div className="text-sm font-semibold text-gray-600 mb-2">Amount to Collect</div>
        <div className="text-4xl font-bold text-green-700">₹{amount?.toFixed(2)}</div>
      </div>

      {/* Payment Reference Confirmation */}
      {paymentRef && (
        <div className="bg-yellow-100 border-4 border-yellow-400 rounded-lg p-4 space-y-3">
          <div className="font-bold text-gray-900">Transaction ID:</div>
          <div className="bg-white border-2 border-yellow-300 rounded-lg p-3 font-mono text-sm font-bold text-center break-all">
            {paymentRef}
          </div>
          <div className="text-sm text-gray-700 font-semibold">✅ Payment received from customer</div>
        </div>
      )}

      {/* Confirm Button */}
      {paymentRef && (
        <button
          onClick={handleProcessPayment}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg text-lg transition"
        >
          {loading ? '⏳ Processing...' : '✅ CONFIRM PAYMENT'}
        </button>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 text-sm text-gray-700">
        <div className="font-bold mb-2">💡 How it works:</div>
        <div>1. Customer shows payment via UPI/Card scan</div>
        <div>2. Tap button to scan payment</div>
        <div>3. Confirm payment to complete task</div>
      </div>
    </div>
  );
}
