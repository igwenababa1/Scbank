
import React, { useState } from 'react';
// FIX: Corrected import path
import { MONTHLY_SUMMARY, BUDGET_CATEGORIES, SAVINGS_GOALS } from '../../constants';
// FIX: Corrected import path
import type { BudgetCategory, SavingsGoal } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import IncomeVsExpenseChart from '../../components/dashboard/budgeting/IncomeVsExpenseChart';
import BudgetCategoryItem from '../../components/dashboard/budgeting/BudgetCategoryItem';
import EditBudgetModal from '../../components/dashboard/budgeting/EditBudgetModal';
import EditSavingsGoalModal from '../../components/dashboard/budgeting/EditSavingsGoalModal';
import EditIncomeModal from '../../components/dashboard/budgeting/EditIncomeModal';

const StatCard: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-sm font-semibold text-gray-500">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{formatCurrency(value)}</p>
    </div>
);

const SavingsGoalItem: React.FC<{ goal: SavingsGoal, onEdit: () => void }> = ({ goal, onEdit }) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-800">{goal.name}</p>
                <button onClick={onEdit} className="text-xs font-semibold text-[#1a365d] hover:underline">Edit</button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-[#1a365d] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatCurrency(goal.currentAmount)}</span>
                <span>{formatCurrency(goal.targetAmount)}</span>
            </div>
        </div>
    );
};

const BudgetingView: React.FC = () => {
    const [monthlySummary, setMonthlySummary] = useState(MONTHLY_SUMMARY);
    const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(BUDGET_CATEGORIES);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(SAVINGS_GOALS);

    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null);
    const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
    const [editingSavingsGoal, setEditingSavingsGoal] = useState<SavingsGoal | null>(null);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

    const handleOpenBudgetModal = (category: BudgetCategory) => {
        setEditingBudget(category);
        setIsBudgetModalOpen(true);
    };

    const handleSaveBudget = (updatedCategory: BudgetCategory) => {
        setBudgetCategories(cats => cats.map(c => c.id === updatedCategory.id ? updatedCategory : c));
        setIsBudgetModalOpen(false);
    };

    const handleOpenSavingsModal = (goal: SavingsGoal | null) => {
        setEditingSavingsGoal(goal);
        setIsSavingsModalOpen(true);
    };

    const handleSaveSavingsGoal = (goal: SavingsGoal) => {
        if (editingSavingsGoal) {
            setSavingsGoals(goals => goals.map(g => g.id === goal.id ? goal : g));
        } else {
            setSavingsGoals(goals => [...goals, { ...goal, id: `sg-${Date.now()}` }]);
        }
        setIsSavingsModalOpen(false);
    };
    
    const handleSaveIncome = (newIncome: number) => {
        setMonthlySummary(prev => ({ ...prev, income: newIncome }));
        setIsIncomeModalOpen(false);
    }

    return (
        <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard label="Monthly Income" value={monthlySummary.income} color="text-green-500" />
                <StatCard label="Expenses this Month" value={monthlySummary.expenses} color="text-red-500" />
                <StatCard label="Saved this Month" value={monthlySummary.savings} color="text-[#1a365d]" />
            </div>

            <IncomeVsExpenseChart />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl text-[#1a365d]">Budget Categories</h3>
                        <button onClick={() => setIsIncomeModalOpen(true)} className="text-sm font-semibold text-[#1a365d] hover:underline">Edit Income</button>
                    </div>
                    <div className="space-y-4">
                        {budgetCategories.map(cat => (
                            <BudgetCategoryItem key={cat.id} category={cat} onEdit={() => handleOpenBudgetModal(cat)} />
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl text-[#1a365d]">Savings Goals</h3>
                        <button onClick={() => handleOpenSavingsModal(null)} className="text-sm font-semibold text-[#1a365d] hover:underline">+ New Goal</button>
                    </div>
                    <div className="space-y-4">
                        {savingsGoals.map(goal => (
                            <SavingsGoalItem key={goal.id} goal={goal} onEdit={() => handleOpenSavingsModal(goal)} />
                        ))}
                    </div>
                </div>
            </div>

            {isBudgetModalOpen && editingBudget && (
                <EditBudgetModal
                    isOpen={isBudgetModalOpen}
                    onClose={() => setIsBudgetModalOpen(false)}
                    category={editingBudget}
                    onSave={handleSaveBudget}
                />
            )}

            {isSavingsModalOpen && (
                <EditSavingsGoalModal
                    isOpen={isSavingsModalOpen}
                    onClose={() => setIsSavingsModalOpen(false)}
                    goal={editingSavingsGoal}
                    onSave={handleSaveSavingsGoal}
                />
            )}
            
            {isIncomeModalOpen && (
                <EditIncomeModal
                    isOpen={isIncomeModalOpen}
                    onClose={() => setIsIncomeModalOpen(false)}
                    currentIncome={monthlySummary.income}
                    onSave={handleSaveIncome}
                />
            )}
        </div>
    );
};

export default BudgetingView;
