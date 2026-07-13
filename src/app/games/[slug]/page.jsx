"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Avatar, Button, Card, CardContent } from "@heroui/react";
import { Gamepad2, Layers, Server, ShieldCheck, Award, Star, User, Info, Coins, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { dashboardService } from "@/services/dashboard";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function GameDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selection states
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [playerId, setPlayerId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  
  // Checkout process states
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    async function loadGameDetails() {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getGameBySlug(slug);
        if (data) {
          setGame(data);
          if (data.packages && data.packages.length > 0) {
            setSelectedPackage(data.packages[0]);
          }
        }
      } catch (err) {
        console.error("Error loading game details:", err);
        setError("Game not found or temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadGameDetails();
    }
  }, [slug]);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to complete your purchase.");
      router.push(`/login?redirect=/games/${slug}`);
      return;
    }

    if (!selectedPackage) {
      toast.error("Please select a top-up package.");
      return;
    }

    if (!playerId.trim()) {
      toast.error("Player ID is required for verification.");
      return;
    }

    try {
      setCheckingOut(true);
      
      // 1. Create order
      const orderPayload = {
        gameId: game._id,
        packageId: selectedPackage._id,
        playerId: playerId.trim(),
        playerName: playerName.trim(),
        quantity: 1,
        paymentMethod
      };

      const orderRes = await dashboardService.createBuyerOrder(orderPayload);
      if (!orderRes) {
        throw new Error("Failed to save order on backend.");
      }

      // Handle both raw object and envelope response
      const order = orderRes.data || orderRes;
      const orderId = order._id;

      // 2. Create payment
      const paymentPayload = {
        orderId,
        paymentMethod
      };

      await dashboardService.createBuyerPayment(paymentPayload);

      toast.success("Order placed and payment record created!");
      setCreatedOrder(order);
      setCheckoutSuccess(true);
    } catch (err) {
      console.error("Checkout process failed:", err);
      toast.error(err.message || "Failed to process order. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-text-muted">Loading game catalog profile...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !game) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <Card className="max-w-md border border-border bg-surface-light p-8 text-center rounded-2xl">
            <Info className="h-10 w-10 text-error mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Game Profile Offline</h2>
            <p className="text-sm text-text-muted mb-6">{error || "Could not retrieve game profile details."}</p>
            <Link href="/" className="inline-flex bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-3 px-6 text-xs transition-all">
              Return Home
            </Link>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#0a0a0f] text-white pt-24 relative">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          
          {checkoutSuccess ? (
            /* Checkout Success Screen */
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20 border border-success/30">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">Order Placed!</h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Your purchase order is successfully created. A pending payment reference has been saved. You can track this order in your buyer panel dashboard.
              </p>
              
              <Card className="border border-border/40 bg-surface-light/40 backdrop-blur-xl p-5 text-left rounded-xl space-y-2">
                <p className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Order ID Reference</p>
                <p className="font-mono text-white select-all text-xs">{createdOrder?._id}</p>
                <div className="flex justify-between text-xs pt-2 border-t border-border/10">
                  <span className="text-text-muted">Total Paid</span>
                  <span className="font-bold text-primary">${createdOrder?.totalPrice?.toFixed(2)}</span>
                </div>
              </Card>

              <div className="flex flex-col gap-3 pt-4">
                <Link
                  href="/dashboard/buyer/orders"
                  className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-4.5 px-6 text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/20"
                >
                  Go to My Orders <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="bg-surface-light border border-border text-text-muted hover:text-white rounded-xl font-bold py-4.5 px-6 text-sm transition-all"
                >
                  Continue Browsing
                </Link>
              </div>
            </div>
          ) : (
            /* Purchase Flow layout */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-24">
              
              {/* Left Column: Game Profile Details */}
              <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
                  {/* Banner */}
                  <div className="h-36 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${game.banner})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-black/30" />
                  </div>
                  
                  <CardContent className="p-6 -mt-8 relative z-10 space-y-6">
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={game.logo}
                        name={game.name}
                        radius="lg"
                        className="w-16 h-16 border-2 border-primary/20 bg-surface shadow-lg flex-shrink-0"
                        fallback={game.name?.charAt(0).toUpperCase()}
                      />
                      <div className="min-w-0 pt-8">
                        <h2 className="text-xl font-bold text-white truncate">{game.name}</h2>
                        <div className="flex items-center gap-1 text-xs text-primary font-bold mt-1">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <span>{Number(game.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-border/10 text-xs">
                      <div>
                        <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider block">Description</span>
                        <p className="text-text-muted leading-relaxed mt-1">{game.shortDescription}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Category</span>
                          <p className="font-semibold text-white mt-0.5">{game.category}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider">Platform</span>
                          <p className="font-semibold text-white mt-0.5">{game.platform}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Columns: Package List, Player Info & Checkout */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Select Package */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary font-bold">1</span>
                    Choose Package
                  </h3>
                  
                  {game.packages?.length === 0 ? (
                    <Card className="border border-border/40 bg-surface-light/40 p-6 text-center text-xs text-text-muted rounded-xl">
                      No packages are currently published for this game.
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {game.packages.map((pkg) => {
                        const isSelected = selectedPackage?._id === pkg._id;
                        return (
                          <div
                            key={pkg._id}
                            onClick={() => setSelectedPackage(pkg)}
                            className={`border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between h-36 ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.01]"
                                : "border-border/60 bg-surface-light/30 hover:border-border"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-white truncate max-w-[80%]">{pkg.name}</h4>
                                {pkg.isPopular && (
                                  <span className="text-[8px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full uppercase">Popular</span>
                                )}
                              </div>
                              <p className="text-[10px] text-text-dim">{pkg.description || "Instant credit transfer delivery."}</p>
                            </div>
                            <div className="flex justify-between items-end border-t border-border/10 pt-2.5">
                              <span className="text-text-muted text-xs flex items-center gap-1 font-bold">
                                <Coins className="h-3.5 w-3.5 text-primary" /> {pkg.amount} Credits
                              </span>
                              <span className="text-base font-extrabold text-primary">${pkg.price?.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Enter Player Info */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary font-bold">2</span>
                    Player Information
                  </h3>
                  <Card className="border border-secondary/15 bg-secondary/5 backdrop-blur-xl rounded-2xl p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">Player ID *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 581902891"
                          value={playerId}
                          onChange={(e) => setPlayerId(e.target.value)}
                          className="h-10 px-3.5 border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus:border-primary transition-all text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-text-dim font-bold uppercase tracking-wider pl-1">In-Game Nickname (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. ShadowHunter"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          className="h-10 px-3.5 border border-border/50 rounded-xl bg-surface/50 text-white outline-none focus:border-primary transition-all text-xs"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 3. Payment Method */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary font-bold">3</span>
                    Choose Payment Method
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "bkash", name: "bKash Wallet" },
                      { id: "nagad", name: "Nagad Wallet" },
                      { id: "sslcommerz", name: "Card / Bank" }
                    ].map((method) => {
                      const isSelected = paymentMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`border rounded-xl p-4 cursor-pointer text-center transition-all select-none ${
                            isSelected
                              ? "border-primary bg-primary/5 text-primary scale-[1.01]"
                              : "border-border/60 bg-surface-light/30 hover:border-border text-text-muted"
                          }`}
                        >
                          <span className="text-xs font-bold block">{method.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Auth State Warning & Place Order Action */}
                <div className="pt-4 border-t border-border/10 space-y-4">
                  {!isAuthenticated ? (
                    <Card className="border border-warning/35 bg-warning/5 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-white">Login required for purchases</p>
                        <p className="text-text-muted">You must log in to register orders and review billing metrics.</p>
                      </div>
                      <Link
                        href={`/login?redirect=/games/${slug}`}
                        className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-2.5 px-5 text-xs transition-all shadow-md shadow-primary/25 shrink-0"
                      >
                        Log In to Purchase
                      </Link>
                    </Card>
                  ) : (
                    <Card className="border border-border/40 bg-surface-light/40 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-xs">
                        <span className="text-[10px] text-text-dim font-bold uppercase tracking-wider block">Checkout Summary</span>
                        <p className="text-sm font-black text-white mt-1">
                          {selectedPackage?.name} — <span className="text-primary">${selectedPackage?.price?.toFixed(2)}</span>
                        </p>
                      </div>
                      <Button
                        isDisabled={checkingOut}
                        onPress={handlePlaceOrder}
                        className="bg-primary hover:bg-primary-dark text-white rounded-xl font-bold py-5.5 px-8 text-sm cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 disabled:opacity-50 shrink-0 w-full sm:w-auto"
                      >
                        {checkingOut && <Loader2 className="h-4 w-4 animate-spin" />}
                        Place Order Now
                      </Button>
                    </Card>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
