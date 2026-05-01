CREATE TABLE IF NOT EXISTS participantes (
  id INTEGER PRIMARY KEY,
  url TEXT,
  estado TEXT CHECK (estado IN ('Aceptado', 'Rechazado', 'Waiting list 1', 'Waiting list 2', 'Waiting list 3')),
  tanda INTEGER,
  comentarios TEXT DEFAULT '',
  top_mid_bot TEXT,
  pais_origen TEXT,
  sr TEXT CHECK (sr IN ('Gonza', 'Lola', 'Pili', 'Roma', 'Sofi') OR sr IS NULL),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movimientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  usuario TEXT NOT NULL,
  participante_id INTEGER REFERENCES participantes(id),
  campo TEXT NOT NULL,
  valor_anterior TEXT,
  valor_nuevo TEXT
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON participantes;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON participantes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_participantes_estado ON participantes(estado);
CREATE INDEX IF NOT EXISTS idx_participantes_sr ON participantes(sr);
CREATE INDEX IF NOT EXISTS idx_movimientos_timestamp ON movimientos(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_movimientos_participante ON movimientos(participante_id);

ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read participantes" ON participantes FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth update participantes" ON participantes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth insert participantes" ON participantes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth read movimientos" ON movimientos FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth insert movimientos" ON movimientos FOR INSERT TO authenticated WITH CHECK (true);
