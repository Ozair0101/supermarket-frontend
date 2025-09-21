import React, { useState, useEffect } from 'react';
import { getSuppliers } from '../../services/supplierService';
import type { Supplier } from '../../services/supplierService';

const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        setError('Failed to fetch suppliers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {suppliers.map((supplier) => (
          <li key={supplier.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {supplier.name}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${supplier.remaining_balance}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {supplier.contact_person || 'No contact person'}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    {supplier.phone || 'No phone'}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>{supplier.email || 'No email'}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierList;