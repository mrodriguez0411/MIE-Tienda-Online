import { IoBagAdd } from "react-icons/io5";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import toast from "react-hot-toast";
export const DashboardCategorys = () => {
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  // 🔹 Cargar categorías directamente desde la tabla categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
  
      if (error) {
        console.error("Error al obtener categorías:", error);
      } else {
        const formattedData = data.map((category: { id: string; name: string }) => ({
          id: Number(category.id),
          name: category.name,
        }));
        setCategories(formattedData);
      }
    };
  
    fetchCategories();
  }, []);
  
  // 🔹 Agregar categoría en categories y vincular en variants
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("La categoría no puede estar vacía.");
  
    // Insertar en categories
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: newCategory }])
      .select();
  

    if (error) {
      console.error("Error al agregar categoría en categories:", error);
      return;
    }
    
    if (data && data.length > 0) {
      const categoryId = data[0].id;
      toast.success("Se ha añadido una nueva categoria", {
        position: "bottom-right",
      });
      // Insertar en variants con el category_id
      const { error: variantError } = await supabase.from("variants").insert([
        {
          category_id: categoryId,
          price: 0, // Valor predeterminado
          product_id: "valid_product_id", // Ajusta con un valor válido o elimina si no es necesario
          stock: 0, // Valor predeterminado
          variant_name: newCategory, // Puedes usar el nombre de la categoría
        },
      ]);
      if (variantError) {
        console.error("Error al asociar categoría en variants:", variantError);
      } else {
        setCategories([...categories, { id: categoryId, name: newCategory }]);
        setNewCategory("");
      }
    }
  };

  // 🔹 Editar categoría en categories
  const handleEditCategory = async () => {
    if (!editingCategory) return;

    const { error } = await supabase
      .from("categories")
      .update({ name: editingCategory.name })
      .eq("id", editingCategory.id);

    if (error) {
      console.error("Error al editar categoría:", error);
    } else {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat
        )
      );
      setEditingCategory(null);
    }
  };

  // 🔹 Eliminar categoría (de categories y variants)
  const handleDeleteCategory = async (categoryId: number) => {
    // Eliminar de variants primero
    const { error: variantError } = await supabase
      .from("variants")
      .delete()
      .eq("category_id", categoryId);

    if (variantError) {
      console.error("Error al eliminar categoría en variants:", variantError);
      return;
    }

    // Luego eliminar de categories
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      console.error("Error al eliminar categoría:", error);
    } else {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Categorías</h2>

      {/* Agregar Categoría */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nueva Categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddCategory}
          className="bg-cyan-800 text-white p-2 rounded flex"
        >
          <IoBagAdd className="ml-1 mr-2" size={20} />
          Agregar
        </button>
      </div>

      {/* Lista de Categorías */}
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex justify-between items-center p-2 border-b"
          >
            {editingCategory?.id === category.id ? (
              <>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="border p-1"
                />
                <button
                  onClick={handleEditCategory}
                  className="bg-green-500 text-white p-1 rounded"
                >
                  Guardar
                </button>
              </>
            ) : (
              <>
                <span>{category.name}</span>
                <div>
                  <button
                    onClick={() =>
                      setEditingCategory({
                        id: category.id,
                        name: category.name,
                      })
                    }
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
