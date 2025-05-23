import { Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-product-create',
  imports: [CommonModule, FormsModule, ToastModule, ButtonModule, RouterModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss',
  providers: [MessageService]
})
export class ProductCreateComponent {

  private readonly productsSvc = inject(ProductService);
  products$ = this.productsSvc.getAllProducts();
  private readonly categoriesSvc = inject(CategoriesService);
  categories$ = this.categoriesSvc.getAllCategories();


  //-------- Mensajes de éxito y error para la creación de productos --------------
  private messageService = inject(MessageService);
  // Mensaje de éxito
  successCreateProductMessage = {
    severity: 'success',
    summary: 'Éxito',
    detail: 'Producto creado con éxito'
  };
  // Mensaje de error
  errorCreateProductMessage = {
    severity: 'error',
    summary: 'Error',
    detail: 'Error al crear el producto'
  };
  showCreateProductSuccess() {
    this.messageService.add(this.successCreateProductMessage);
  }
  showCreateProductError() {
    this.messageService.add(this.errorCreateProductMessage);
  }
  showEditProductError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al editar el producto'
    });
  }
  showEditProductSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Producto editado con éxito'
    });
  }
  showFormError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Por favor complete todos los campos obligatorios correctamente'
    });
  }

  //crear nuevo producto
  newProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    available: true,
    categoryId: '',
    imageUrl: '',
    discountPercentage: 0
  };

  createProduct() {
    if (!this.newProduct.name || !this.newProduct.description || this.newProduct.price <= 0) {
      this.showFormError();
      return;
    }

    this.productsSvc.createProduct(this.newProduct).subscribe({
      next: () => {
        // Resetear formulario
        this.newProduct = {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          available: true,
          categoryId: '',
          imageUrl: '',
          discountPercentage: 0
        };

        // Actualizar lista de productos
        this.products$ = this.productsSvc.getAllProducts();

        this.showCreateProductSuccess();
      },
      error: (error) => {
        console.error('Error al crear producto:', error);

        // Mostrar mensaje más detallado del error
        let errorMsg = 'Error al crear producto';
        if (error.error && error.error.message) {
          errorMsg += ': ' + error.error.message;
        } else if (error.message) {
          errorMsg += ': ' + error.message;
        }
        this.showCreateProductError();
      }
    });
  }

  //eliminar producto
  deleteProduct(productId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productsSvc.deleteProduct(productId).subscribe({
        next: () => {
          // Actualizar lista de productos
          this.products$ = this.productsSvc.getAllProducts();
          alert('Producto eliminado con éxito');
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          alert('Error al eliminar producto');
        }
      });
    }
  }

  //actualizar producto

  // Variables para edición de productos
  editProductId: number | null = null;
  editingProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    available: true,
    categoryId: '',
    imageUrl: '',
    discountPercentage: 0
  };

  // Método para iniciar la edición de un producto
  startEditProduct(product: any) {
    this.editProductId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id;
    console.log('Producto original:', product);
    this.editingProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      available: product.available,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      discountPercentage: product.discountPercentage
    };
    console.log('Objeto enviado:', this.editingProduct);
  }

  // Método para cancelar la edición
  cancelEditProduct() {
    this.editProductId = null;
    this.editingProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      available: true,
      categoryId: '',
      imageUrl: '',
      discountPercentage: 0
    };
  }

  // Método para actualizar un producto
  updateProduct() {
    if (!this.editProductId) {
      return;
    }

    // Convertir el ID a número y verificar que sea válido
    const productId = Number(this.editProductId);
    if (isNaN(productId) || productId <= 0) {
      alert('Error: ID del producto no válido');
      return;
    }

    if (!this.editingProduct.name || !this.editingProduct.description || this.editingProduct.price <= 0) {
      alert('Por favor complete todos los campos obligatorios correctamente');
      return;
    }

    this.productsSvc.updateProduct(this.editProductId, this.editingProduct).subscribe({
      next: () => {
        // Resetear el estado de edición
        this.editProductId = null;
        this.editingProduct = {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          available: true,
          categoryId: '',
          imageUrl: '',
          discountPercentage: 0
        };

        // Actualizar lista de productos
        this.products$ = this.productsSvc.getAllProducts();

        alert('Producto actualizado con éxito');
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        // Mostrar mensaje más detallado del error
        let errorMsg = 'Error al actualizar producto';
        if (error.error && error.error.message) {
          errorMsg += ': ' + error.error.message;
        } else if (error.message) {
          errorMsg += ': ' + error.message;
        }
        alert(errorMsg);
      }
    });
  }




  //---------------------------Categorias ---------------------------
  // Mostrar todas las categorías
  async deleteCategory(categoryId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await this.categoriesSvc.deleteCategory(categoryId).toPromise();
        // Actualizar lista de categorías
        this.categories$ = this.categoriesSvc.getAllCategories();
        alert('Categoría eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert('Error al eliminar categoría');
      }
    }
  }
  // Variables para edición de categorías
  editCategoryId: string | null = null;
  editingCategory = {
    name: '',
    description: ''
  };

  // Método para crear una nueva categoría

  // Variables para crear una nueva categoría
  newCategory = {
    name: '',
    description: ''
  };

  async createCategory() {
    // Validación básica de datos antes de enviar
    if (!this.newCategory.name || !this.newCategory.description) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      await this.categoriesSvc.createCategory(this.newCategory).toPromise();
      // Actualizar lista de categorías
      this.categories$ = this.categoriesSvc.getAllCategories();
      // Reiniciar formulario
      this.newCategory = {
        name: '',
        description: ''
      };
      alert('Categoría creada con éxito');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      alert('Error al crear categoría');
    }
  }
  // Método para cancelar la creación de una categoría
  cancelCreateCategory() {
    this.newCategory = {
      name: '',
      description: ''
    };
  }


  // Método para iniciar la edición de una categoría
  startEditCategory(category: any) {
    this.editCategoryId = category.id;
    this.editingCategory = {
      name: category.name,
      description: category.description
    };
  }

  // Método para cancelar la edición
  cancelEditCategory() {
    this.editCategoryId = null;
    this.editingCategory = {
      name: '',
      description: ''
    };
  }


  // Actualizar categoría
  updateCategory() {
    if (!this.editCategoryId) {
      return;
    }

    if (!this.editingCategory.name || !this.editingCategory.description) {
      alert('Por favor complete todos los campos obligatorios correctamente');
      return;
    }

    this.categoriesSvc.updateCategory(this.editCategoryId, this.editingCategory).subscribe({
      next: () => {
        // Resetear el estado de edición
        this.editCategoryId = null;
        this.editingCategory = {
          name: '',
          description: ''
        };

        // Actualizar lista de categorías
        this.categories$ = this.categoriesSvc.getAllCategories();

        alert('Categoría actualizada con éxito');
      },
      error: (error) => {
        console.error('Error al actualizar categoría:', error);
        // Mostrar mensaje más detallado del error
        let errorMsg = 'Error al actualizar categoría';
        if (error.error && error.error.message) {
          errorMsg += ': ' + error.error.message;
        } else if (error.message) {
          errorMsg += ': ' + error.message;
        }
        alert(errorMsg);
      }
    });
  }

}
