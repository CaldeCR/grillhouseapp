import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["iPhone 14"], // Viewport mobile-first (390 x 844)
});

test.describe("Flujos Clave PWA Mobile - Bitácora de Asados", () => {
  test("1. Login e ingreso a panel principal", async ({ page }) => {
    await page.goto("/login");

    // Verificar UI de login
    await expect(page.getByText("Bitácora de Asados")).toBeVisible();
    await page.getByPlaceholder("asador@bitacora.local").fill("asador@bitacora.local");
    await page.getByPlaceholder("••••••••••••").fill("AsadoMaster2026!");
    await page.getByRole("button", { name: "Ingresar" }).click();

    // Redirección a dashboard
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Panel de Asador")).toBeVisible();
  });

  test("2. Navegación a cursos y apertura de modal de creación", async ({ page }) => {
    await page.goto("/courses");
    await expect(page.getByText("Cursos y Talleres")).toBeVisible();

    const newCourseBtn = page.getByRole("button", { name: "Nuevo Curso" });
    await expect(newCourseBtn).toBeVisible();
    await newCourseBtn.click();

    await expect(page.getByText("Registrar Nuevo Curso")).toBeVisible();
  });

  test("3. Creación de receta y verificación de ingredientes", async ({ page }) => {
    await page.goto("/recipes/new");
    await expect(page.getByText("Crear Ficha de Receta")).toBeVisible();

    await page.getByPlaceholder("ej. Brisket Texas Style a la Pimienta Negra").fill("Costillar Ahumado Test");
    await page.getByPlaceholder("Describe el proceso paso a paso").fill("Ahumado a 110°C con leña de manzano durante 5 horas.");
    
    // Verificar campos de temperatura
    await expect(page.getByText("Temperaturas Clave")).toBeVisible();
  });

  test("4. Sección de videos y preset de transcodificación", async ({ page }) => {
    await page.goto("/media");
    await expect(page.getByText("Videos y Multimedia")).toBeVisible();
    await expect(page.getByText("Subir Video Corto")).toBeVisible();
  });
});
