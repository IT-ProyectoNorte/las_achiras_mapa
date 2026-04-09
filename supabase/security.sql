-- ============================================
-- Políticas de Seguridad RLS para "Las Achiras"
-- ============================================
-- Este script configura la tabla Achiras como SOLO LECTURA.
-- Los usuarios pueden VER los datos pero NUNCA modificarlos.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Habilitar Row Level Security en la tabla Achiras
ALTER TABLE public."Achiras" ENABLE ROW LEVEL SECURITY;

-- 2. Política de lectura pública: cualquiera puede hacer SELECT
CREATE POLICY "Achiras son visibles publicamente"
  ON public."Achiras"
  FOR SELECT
  USING (true);

-- 3. Política DENY para INSERT: nadie puede insertar
CREATE POLICY "Achiras no se pueden insertar"
  ON public."Achiras"
  FOR INSERT
  WITH CHECK (false);

-- 4. Política DENY para UPDATE: nadie puede modificar
CREATE POLICY "Achiras no se pueden actualizar"
  ON public."Achiras"
  FOR UPDATE
  USING (false)
  WITH CHECK (false);

-- 5. Política DENY para DELETE: nadie puede eliminar
CREATE POLICY "Achiras no se pueden eliminar"
  ON public."Achiras"
  FOR DELETE
  USING (false);

-- ============================================
-- Verificación: listar políticas aplicadas
-- ============================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'Achiras';
