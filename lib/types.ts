export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      administracion: {
        Row: {
          clasificacion_tisular: string | null
          concentracion_maxima_mg_ml: number | null
          concentracion_minima_mg_ml: number | null
          created_at: string
          dosis_maxima_administracion: number | null
          dosis_maxima_unidad: string | null
          id: string
          notas: string | null
          principio_activo_id: string
          procedimiento_extravasacion: string | null
          referencia_id: string | null
          tiempo_minimo_infusion_min: number | null
          updated_at: string
          velocidad_maxima_ml_h: number | null
          via: string
        }
        Insert: {
          clasificacion_tisular?: string | null
          concentracion_maxima_mg_ml?: number | null
          concentracion_minima_mg_ml?: number | null
          created_at?: string
          dosis_maxima_administracion?: number | null
          dosis_maxima_unidad?: string | null
          id?: string
          notas?: string | null
          principio_activo_id: string
          procedimiento_extravasacion?: string | null
          referencia_id?: string | null
          tiempo_minimo_infusion_min?: number | null
          updated_at?: string
          velocidad_maxima_ml_h?: number | null
          via: string
        }
        Update: {
          clasificacion_tisular?: string | null
          concentracion_maxima_mg_ml?: number | null
          concentracion_minima_mg_ml?: number | null
          created_at?: string
          dosis_maxima_administracion?: number | null
          dosis_maxima_unidad?: string | null
          id?: string
          notas?: string | null
          principio_activo_id?: string
          procedimiento_extravasacion?: string | null
          referencia_id?: string | null
          tiempo_minimo_infusion_min?: number | null
          updated_at?: string
          velocidad_maxima_ml_h?: number | null
          via?: string
        }
        Relationships: [
          {
            foreignKeyName: "administracion_principio_activo_id_fkey"
            columns: ["principio_activo_id"]
            isOneToOne: false
            referencedRelation: "principio_activo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "administracion_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencia"
            referencedColumns: ["id"]
          },
        ]
      }
      cima_sync_log: {
        Row: {
          codigo_nacional: string
          created_at: string
          detalle: Json | null
          id: string
          tipo_evento: string
        }
        Insert: {
          codigo_nacional: string
          created_at?: string
          detalle?: Json | null
          id?: string
          tipo_evento: string
        }
        Update: {
          codigo_nacional?: string
          created_at?: string
          detalle?: Json | null
          id?: string
          tipo_evento?: string
        }
        Relationships: []
      }
      compatibilidad_diluente: {
        Row: {
          condiciones: string | null
          created_at: string
          diluente: string
          id: string
          mecanismo: string | null
          principio_activo_id: string
          referencia_id: string | null
          resultado: string
          updated_at: string
        }
        Insert: {
          condiciones?: string | null
          created_at?: string
          diluente: string
          id?: string
          mecanismo?: string | null
          principio_activo_id: string
          referencia_id?: string | null
          resultado: string
          updated_at?: string
        }
        Update: {
          condiciones?: string | null
          created_at?: string
          diluente?: string
          id?: string
          mecanismo?: string | null
          principio_activo_id?: string
          referencia_id?: string | null
          resultado?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compatibilidad_diluente_principio_activo_id_fkey"
            columns: ["principio_activo_id"]
            isOneToOne: false
            referencedRelation: "principio_activo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compatibilidad_diluente_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencia"
            referencedColumns: ["id"]
          },
        ]
      }
      compatibilidad_material: {
        Row: {
          condiciones: string | null
          created_at: string
          id: string
          material: string
          principio_activo_id: string
          referencia_id: string | null
          resultado: string
          updated_at: string
        }
        Insert: {
          condiciones?: string | null
          created_at?: string
          id?: string
          material: string
          principio_activo_id: string
          referencia_id?: string | null
          resultado: string
          updated_at?: string
        }
        Update: {
          condiciones?: string | null
          created_at?: string
          id?: string
          material?: string
          principio_activo_id?: string
          referencia_id?: string | null
          resultado?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compatibilidad_material_principio_activo_id_fkey"
            columns: ["principio_activo_id"]
            isOneToOne: false
            referencedRelation: "principio_activo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compatibilidad_material_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencia"
            referencedColumns: ["id"]
          },
        ]
      }
      compatibilidad_y: {
        Row: {
          concentracion_a_mg_ml: number | null
          concentracion_b_mg_ml: number | null
          condiciones: string | null
          created_at: string
          diluyente: string | null
          id: string
          principio_activo_a_id: string
          principio_activo_b_id: string
          referencia_id: string | null
          resultado: string
          updated_at: string
        }
        Insert: {
          concentracion_a_mg_ml?: number | null
          concentracion_b_mg_ml?: number | null
          condiciones?: string | null
          created_at?: string
          diluyente?: string | null
          id?: string
          principio_activo_a_id: string
          principio_activo_b_id: string
          referencia_id?: string | null
          resultado: string
          updated_at?: string
        }
        Update: {
          concentracion_a_mg_ml?: number | null
          concentracion_b_mg_ml?: number | null
          condiciones?: string | null
          created_at?: string
          diluyente?: string | null
          id?: string
          principio_activo_a_id?: string
          principio_activo_b_id?: string
          referencia_id?: string | null
          resultado?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compatibilidad_y_principio_activo_a_id_fkey"
            columns: ["principio_activo_a_id"]
            isOneToOne: false
            referencedRelation: "principio_activo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compatibilidad_y_principio_activo_b_id_fkey"
            columns: ["principio_activo_b_id"]
            isOneToOne: false
            referencedRelation: "principio_activo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compatibilidad_y_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencia"
            referencedColumns: ["id"]
          },
        ]
      }
      condicion_preparacion: {
        Row: {
          concentracion_final_maxima: number | null
          concentracion_final_minima: number | null
          created_at: string
          diluyente: string
          envase_compatible: string[] | null
          filtro_prohibido: boolean
          filtro_requerido: string | null
          id: string
          notas: string | null
          overfill_notas: string | null
          presentacion_comercial_id: string | null
          principio_activo_id: string
          proteccion_luz: boolean
          tipo: string
          updated_at: string
          volumen_bolsa_recomendado_ml: string | null
          volumen_ml_maximo: number | null
          volumen_ml_minimo: number | null
        }
        Insert: {
          concentracion_final_maxima?: number | null
          concentracion_final_minima?: number | null
          created_at?: string
          diluyente: string
          envase_compatible?: string[] | null
          filtro_prohibido?: boolean
          filtro_requerido?: string | null
          id?: string
          notas?: string | null
          overfill_notas?: string | null
          presentacion_comercial_id?: string | null
          principio_activo_id: string
          proteccion_luz?: boolean
          tipo: string
          updated_at?: string
          volumen_bolsa_recomendado_ml?: string | null
          volumen_ml_maximo?: number | null
          volumen_ml_minimo?: number | null
        }
        Update: {
          concentracion_final_maxima?: number | null
          concentracion_final_minima?: number | null
          created_at?: string
          diluyente?: string
          envase_compatible?: string[] | null
          filtro_prohibido?: boolean
          filtro_requerido?: string | null
          id?: string
          notas?: string | null
          overfill_notas?: string | null
          presentacion_comercial_id?: string | null
          principio_activo_id?: string
          proteccion_luz?: boolean
          tipo?: string
          updated_at?: string
          volumen_bolsa_recomendado_ml?: string | null
          volumen_ml_maximo?: number | null
          volumen_ml_minimo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "condicion_preparacion_presentacion_comercial_id_fkey"
            columns: ["presentacion_comercial_id"]
            isOneToOne: false
            referencedRelation: "presentacion_comercial"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "condicion_preparacion_principio_activo_id_fkey"
            columns: ["principio_activo_id"]
            isOneToOne: false
            referencedRelation: "principio_activo"
            referencedColumns: ["id"]
          },
        ]
      }
      envase: {
        Row: {
          codigo_nacional: string | null
          comercializado: boolean
          created_at: string
          estado_comercializacion: string | null
          id: string
          presentacion_id: string
          problema_suministro: boolean
          updated_at: string
          volumen_ml: number | null
        }
        Insert: {
          codigo_nacional?: string | null
          comercializado?: boolean
          created_at?: string
          estado_comercializacion?: string | null
          id?: string
          presentacion_id: string
          problema_suministro?: boolean
          updated_at?: string
          volumen_ml?: number | null
        }
        Update: {
          codigo_nacional?: string | null
          comercializado?: boolean
          created_at?: string
          estado_comercializacion?: string | null
          id?: string
          presentacion_id?: string
          problema_suministro?: boolean
          updated_at?: string
          volumen_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "envase_presentacion_id_fkey"
            columns: ["presentacion_id"]
            isOneToOne: false
            referencedRelation: "presentacion_comercial"
            referencedColumns: ["id"]
          },
        ]
      }
      estabilidad: {
        Row: {
          concentracion_mg_ml: number | null
          created_at: string
          diluyente: string | null
          envase: string | null
          id: string
          nivel_evidencia: string | null
          notas_cualitativas: string | null
          presentacion_comercial_id: string | null
          principio_activo_id: string
          proteccion_luz: boolean | null
          referencia_id: string | null
          temperatura_celsius: number | null
          tiempo_horas: number
          tipo_estabilidad: string | null
          updated_at: string
        }
        Insert: {
          concentracion_mg_ml?: number | null
          created_at?: string
          diluyente?: string | null
          envase?: string | null
          id?: string
          nivel_evidencia?: string | null
          notas_cualitativas?: string | null
          presentacion_comercial_id?: string | null
          principio_activo_id: string
          proteccion_luz?: boolean | null
          referencia_id?: string | null
          temperatura_celsius?: number | null
          tiempo_horas: number
          tipo_estabilidad?: string | null
          updated_at?: string
        }
        Update: {
          concentracion_mg_ml?: number | null
          created_at?: string
          diluyente?: string | null
          envase?: string | null
          id?: string
          nivel_evidencia?: string | null
          notas_cualitativas?: string | null
          presentacion_comercial_id?: string | null
          principio_activo_id?: string
          proteccion_luz?: boolean | null
          referencia_id?: string | null
          temperatura_celsius?: number | null
          tiempo_horas?: number
          tipo_estabilidad?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estabilidad_presentacion_comercial_id_fkey"
            columns: ["presentacion_comercial_id"]
            isOneToOne: false
            referencedRelation: "presentacion_comercial"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estabilidad_principio_activo_id_fkey"
            columns: ["principio_activo_id"]
            isOneToOne: false
            referencedRelation: "principio_activo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estabilidad_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencia"
            referencedColumns: ["id"]
          },
        ]
      }
      gobernanza: {
        Row: {
          autor: string | null
          coordinador_validador: string | null
          created_at: string
          estado: string
          fecha_proxima_revision: string | null
          fecha_validacion: string | null
          historial_cambios: Json | null
          id: string
          registro_id: string
          revisor_1: string | null
          revisor_2: string | null
          tabla_origen: string
          updated_at: string
          version: number
        }
        Insert: {
          autor?: string | null
          coordinador_validador?: string | null
          created_at?: string
          estado?: string
          fecha_proxima_revision?: string | null
          fecha_validacion?: string | null
          historial_cambios?: Json | null
          id?: string
          registro_id: string
          revisor_1?: string | null
          revisor_2?: string | null
          tabla_origen: string
          updated_at?: string
          version?: number
        }
        Update: {
          autor?: string | null
          coordinador_validador?: string | null
          created_at?: string
          estado?: string
          fecha_proxima_revision?: string | null
          fecha_validacion?: string | null
          historial_cambios?: Json | null
          id?: string
          registro_id?: string
          revisor_1?: string | null
          revisor_2?: string | null
          tabla_origen?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      matriz_riesgo: {
        Row: {
          clasificacion_niosh: string | null
          created_at: string
          epi_requerido: string[] | null
          gestion_residuos: string | null
          id: string
          notas: string | null
          principio_activo_id: string
          requisitos_sala: string | null
          tipo_cabina: string | null
          updated_at: string
        }
        Insert: {
          clasificacion_niosh?: string | null
          created_at?: string
          epi_requerido?: string[] | null
          gestion_residuos?: string | null
          id?: string
          notas?: string | null
          principio_activo_id: string
          requisitos_sala?: string | null
          tipo_cabina?: string | null
          updated_at?: string
        }
        Update: {
          clasificacion_niosh?: string | null
          created_at?: string
          epi_requerido?: string[] | null
          gestion_residuos?: string | null
          id?: string
          notas?: string | null
          principio_activo_id?: string
          requisitos_sala?: string | null
          tipo_cabina?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matriz_riesgo_principio_activo_id_fkey"
            columns: ["principio_activo_id"]
            isOneToOne: true
            referencedRelation: "principio_activo"
            referencedColumns: ["id"]
          },
        ]
      }
      presentacion_comercial: {
        Row: {
          cima_datos_raw: Json | null
          cima_last_sync: string | null
          con_conservantes: boolean | null
          concentracion_unidad: string | null
          concentracion_valor: number | null
          conservantes_detalle: string | null
          created_at: string
          densidad: number | null
          estabilidad_fuera_nevera_horas: number | null
          excipientes: Json | null
          ficha_tecnica_url: string | null
          forma_farmaceutica: string | null
          id: string
          laboratorio_titular: string | null
          nombre_comercial: string
          nregistro_cima: string | null
          osmolaridad_mosm_l: number | null
          ph_maximo: number | null
          ph_minimo: number | null
          principio_activo_id: string
          proteccion_luz_almacenamiento: boolean
          temperatura_conservacion: string | null
          updated_at: string
        }
        Insert: {
          cima_datos_raw?: Json | null
          cima_last_sync?: string | null
          con_conservantes?: boolean | null
          concentracion_unidad?: string | null
          concentracion_valor?: number | null
          conservantes_detalle?: string | null
          created_at?: string
          densidad?: number | null
          estabilidad_fuera_nevera_horas?: number | null
          excipientes?: Json | null
          ficha_tecnica_url?: string | null
          forma_farmaceutica?: string | null
          id?: string
          laboratorio_titular?: string | null
          nombre_comercial: string
          nregistro_cima?: string | null
          osmolaridad_mosm_l?: number | null
          ph_maximo?: number | null
          ph_minimo?: number | null
          principio_activo_id: string
          proteccion_luz_almacenamiento?: boolean
          temperatura_conservacion?: string | null
          updated_at?: string
        }
        Update: {
          cima_datos_raw?: Json | null
          cima_last_sync?: string | null
          con_conservantes?: boolean | null
          concentracion_unidad?: string | null
          concentracion_valor?: number | null
          conservantes_detalle?: string | null
          created_at?: string
          densidad?: number | null
          estabilidad_fuera_nevera_horas?: number | null
          excipientes?: Json | null
          ficha_tecnica_url?: string | null
          forma_farmaceutica?: string | null
          id?: string
          laboratorio_titular?: string | null
          nombre_comercial?: string
          nregistro_cima?: string | null
          osmolaridad_mosm_l?: number | null
          ph_maximo?: number | null
          ph_minimo?: number | null
          principio_activo_id?: string
          proteccion_luz_almacenamiento?: boolean
          temperatura_conservacion?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentacion_comercial_principio_activo_id_fkey"
            columns: ["principio_activo_id"]
            isOneToOne: false
            referencedRelation: "principio_activo"
            referencedColumns: ["id"]
          },
        ]
      }
      principio_activo: {
        Row: {
          atc_code: string | null
          clasificacion_niosh: string | null
          consideraciones_neonatales: string | null
          consideraciones_pediatricas: string | null
          created_at: string
          dci: string
          familia_farmacologica: string | null
          id: string
          notas_seguridad: string | null
          sinonimos: string[] | null
          updated_at: string
        }
        Insert: {
          atc_code?: string | null
          clasificacion_niosh?: string | null
          consideraciones_neonatales?: string | null
          consideraciones_pediatricas?: string | null
          created_at?: string
          dci: string
          familia_farmacologica?: string | null
          id?: string
          notas_seguridad?: string | null
          sinonimos?: string[] | null
          updated_at?: string
        }
        Update: {
          atc_code?: string | null
          clasificacion_niosh?: string | null
          consideraciones_neonatales?: string | null
          consideraciones_pediatricas?: string | null
          created_at?: string
          dci?: string
          familia_farmacologica?: string | null
          id?: string
          notas_seguridad?: string | null
          sinonimos?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      referencia: {
        Row: {
          anio: number | null
          autores: string | null
          created_at: string
          doi: string | null
          fecha_consulta: string | null
          id: string
          notas: string | null
          revista: string | null
          tipo_fuente: string
          titulo: string
          updated_at: string
          url: string | null
        }
        Insert: {
          anio?: number | null
          autores?: string | null
          created_at?: string
          doi?: string | null
          fecha_consulta?: string | null
          id?: string
          notas?: string | null
          revista?: string | null
          tipo_fuente: string
          titulo: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          anio?: number | null
          autores?: string | null
          created_at?: string
          doi?: string | null
          fecha_consulta?: string | null
          id?: string
          notas?: string | null
          revista?: string | null
          tipo_fuente?: string
          titulo?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
A new version of Supabase CLI is available: v2.90.0 (currently installed v2.62.10)
We recommend updating regularly for new features and bug fixes: https://supabase.com/docs/guides/cli/getting-started#updating-the-supabase-cli
