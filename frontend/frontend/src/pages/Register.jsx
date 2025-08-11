import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OTPInput from "../components/OTPInput";
import { useAuth } from "../context/AuthContext";
import { resendOtpApi } from "../services/api";
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Register.module.css"; // 👈

const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

const schema = z.object({
  nombre: z.string().trim().min(1, "Nombre es obligatorio"),
  apellidoPaterno: z.string().trim().min(1, "Apellido paterno es obligatorio"),
  apellidoMaterno: z.string().trim().optional().default(""),
  correo: z.string().trim().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").refine(v => passwordPolicy.test(v), {
    message: "Debe tener mayúscula, minúscula, número y símbolo",
  }),
  password2: z.string(),
}).refine(d => d.password === d.password2, {
  message: "Las contraseñas no coinciden",
  path: ["password2"],
});

function strength(pwd) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^\w\s]/.test(pwd)) s++;
  return Math.min(s, 4);
}

export default function Register() {
  const { register: doRegister, verifyOtp } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const { register, handleSubmit, formState, watch } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      nombre: "", apellidoPaterno: "", apellidoMaterno: "",
      correo: "", password: "", password2: "",
    },
  });

  const pwd = watch("password");
  const correo = watch("correo");
  const score = useMemo(() => strength(pwd || ""), [pwd]);
  const canSubmit = formState.isValid && !loading;

  const onSubmit = async (values) => {
    setServerErr(""); setLoading(true);
    try { await doRegister(values); setStep(2); }
    catch (e) { setServerErr(e.response?.data?.message || "No se pudo registrar"); }
    finally { setLoading(false); }
  };

  const verify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return;
    setServerErr(""); setLoading(true);
    try { await verifyOtp(correo, otp); nav("/", { replace: true }); }
    catch (e) { setServerErr(e.response?.data?.message || "OTP inválido"); }
    finally { setLoading(false); }
  };

  const resend = async () => {
    try { await resendOtpApi(correo); alert("Se envió un nuevo código"); }
    catch { alert("No se pudo reenviar el código"); }
  };

  const base = "w-full rounded-2xl border bg-white/80 p-3 pl-11 pr-12 outline-none transition";
  const ok   = "border-slate-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-300";
  const bad  = "border-red-300 focus:ring-2 focus:ring-red-300";
  const cls = (name) => formState.errors[name] ? `${base} ${bad}` : `${base} ${ok}`;
  const err = (name) => formState.errors[name]?.message;

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="relative w-full max-w-lg">
        {/* brillo sutil detrás */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 rounded-[28px] blur-lg opacity-25" />
        <div className="relative rounded-[24px] bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl p-6">
          {step === 1 ? (
            <>
              <h1 className="text-3xl font-extrabold mb-1">
                <span className="text-pink-600">Crear</span>{" "}
                <span className="text-indigo-600">cuenta</span>
              </h1>
              <p className="text-sm text-slate-600 mb-5">Ingresa tus datos para registrarte.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                    <input className={cls("nombre")} placeholder="Nombre *" {...register("nombre")} />
                    {err("nombre") && <p className="text-xs text-red-600 mt-1">{err("nombre")}</p>}
                  </div>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                    <input className={cls("apellidoPaterno")} placeholder="Apellido paterno *" {...register("apellidoPaterno")} />
                    {err("apellidoPaterno") && <p className="text-xs text-red-600 mt-1">{err("apellidoPaterno")}</p>}
                  </div>
                  <div className="relative md:col-span-2">
                    <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                    <input className={cls("apellidoMaterno")} placeholder="Apellido materno (opcional)" {...register("apellidoMaterno")} />
                  </div>
                </div>

                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <input type="email" className={cls("correo")} placeholder="Correo *" {...register("correo")} />
                  {err("correo") && <p className="text-xs text-red-600 mt-1">{err("correo")}</p>}
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type={show1 ? "text" : "password"}
                    className={cls("password")}
                    placeholder="Contraseña *"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShow1(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100"
                    aria-label={show1 ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {show1 ? <FaEyeSlash /> : <FaEye />}
                  </button>

                  {/* medidor */}
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={[
                        "h-full transition-all",
                        score === 0 && "w-0",
                        score === 1 && "w-1/4 bg-red-400",
                        score === 2 && "w-2/4 bg-orange-400",
                        score === 3 && "w-3/4 bg-yellow-400",
                        score === 4 && "w-full bg-emerald-500",
                      ].filter(Boolean).join(" ")}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Debe incluir mayúscula, minúscula, número y símbolo.
                  </p>
                  {err("password") && <p className="text-xs text-red-600">{err("password")}</p>}
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type={show2 ? "text" : "password"}
                    className={cls("password2")}
                    placeholder="Confirmar contraseña *"
                    {...register("password2")}
                  />
                  <button
                    type="button"
                    onClick={() => setShow2(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100"
                    aria-label={show2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {show2 ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {err("password2") && <p className="text-xs text-red-600 mt-1">{err("password2")}</p>}
                </div>

                {serverErr && <p className="text-sm text-red-600">{serverErr}</p>}

                <button
                  disabled={!canSubmit}
                  className={`w-full rounded-2xl py-3 font-semibold text-white transition
                    ${canSubmit ? "bg-pink-600 hover:opacity-90" : "bg-pink-300 cursor-not-allowed"}`}
                >
                  {loading ? "Enviando..." : "Registrarme"}
                </button>

                <p className="text-sm mt-2">
                  ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-600 underline">Inicia sesión</Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2">Verifica tu correo</h1>
              <p className="text-sm text-slate-600 mb-4">Te enviamos un código de 6 dígitos.</p>

              <form onSubmit={verify} className="space-y-4">
                <OTPInput value={otp} onChange={setOtp} />
                {serverErr && <p className="text-sm text-red-600">{serverErr}</p>}
                <button
                  disabled={!/^\d{6}$/.test(otp) || loading}
                  className={`w-full rounded-2xl py-3 font-semibold text-white transition
                    ${/^\d{6}$/.test(otp) && !loading ? "bg-indigo-600 hover:opacity-90" : "bg-indigo-300 cursor-not-allowed"}`}
                >
                  {loading ? "Verificando..." : "Verificar y entrar"}
                </button>
              </form>

              <button onClick={resend} className="mt-3 text-sm text-pink-700 underline">
                Reenviar código
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
