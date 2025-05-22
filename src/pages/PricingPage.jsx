import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, ShieldAlert, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';

// It's best practice to load Stripe.js outside of a component's render cycle.
// Replace with your actual publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY_HERE');


const pricingPlans = [
  {
    name: 'Basic Link',
    priceId: 'YOUR_BASIC_PRICE_ID_HERE', // Replace with your Stripe Price ID
    price: 'Free',
    priceSuffix: '',
    description: 'Standard .cipher.com links.',
    features: [
      'Standard random short codes',
      'cipher.com subdomain',
      'Basic click analytics',
      'Community support'
    ],
    icon: <Zap className="h-8 w-8 text-purple-400" />,
    actionLabel: 'Use for Free',
    isFree: true,
  },
  {
    name: 'Pro Custom Domain',
    priceId: 'YOUR_PRO_PRICE_ID_HERE', // Replace with your Stripe Price ID for .com, .net etc.
    price: '$10',
    priceSuffix: '/month',
    description: 'Use your own custom domain (e.g., yourbrand.com).',
    features: [
      'Everything in Basic, plus:',
      'Connect your own domain (.com, .net, .io, etc.)',
      'Branded short links (e.g., yourbrand.com/promo)',
      'Advanced analytics (coming soon)',
      'Priority email support'
    ],
    icon: <Star className="h-8 w-8 text-yellow-400" />,
    actionLabel: 'Get Pro Domain',
    isFree: false,
    highlight: true,
  },
];

const PricingPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(null); // To track loading state per plan

  const handleCheckout = async (priceId, planName) => {
    if (!priceId || priceId.startsWith('YOUR_')) {
        toast({
            variant: 'destructive',
            title: 'Configuration Error',
            description: `Stripe Price ID for "${planName}" is not configured. Please contact support or the admin.`,
        });
        setIsLoading(null);
        return;
    }

    setIsLoading(priceId);
    const stripe = await stripePromise;
    if (!stripe) {
        toast({ variant: 'destructive', title: 'Stripe Error', description: 'Stripe.js failed to load.' });
        setIsLoading(null);
        return;
    }

    try {
      // When the customer clicks on the button, redirect them to Checkout.
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription', // or 'payment' if it's a one-time purchase for the domain
        successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/pricing`, // Replace with your cancel URL
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        toast({
          variant: 'destructive',
          title: 'Checkout Error',
          description: error.message || 'Could not initiate checkout. Please try again.',
        });
      }
    } catch (error) {
      console.error('General error during checkout:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(null);
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      className="container mx-auto py-12 px-4"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
    >
      <motion.section variants={itemVariants} className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          <span className="gradient-text">Flexible Plans</span> for Everyone.
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Choose the perfect plan to supercharge your links. Whether you're starting out or need advanced custom domain features.
        </p>
      </motion.section>

      <motion.div variants={itemVariants} className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {pricingPlans.map((plan) => (
          <motion.div key={plan.name} variants={itemVariants} className={`flex ${plan.highlight ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
            <Card className={`w-full flex flex-col glassmorphic shadow-2xl ${plan.highlight ? 'border-purple-500 border-2 ring-2 ring-purple-400' : 'border-slate-700'}`}>
              <CardHeader className="text-center">
                <div className="mb-4 flex justify-center">{plan.icon}</div>
                <CardTitle className={`text-3xl font-bold ${plan.highlight ? 'gradient-text' : 'text-gray-100'}`}>{plan.name}</CardTitle>
                <CardDescription className="text-gray-400 text-lg mt-2">{plan.description}</CardDescription>
                <p className="text-4xl font-extrabold text-gray-50 my-4">
                  {plan.price}
                  {plan.priceSuffix && <span className="text-base font-normal text-gray-400">{plan.priceSuffix}</span>}
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-gray-300">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                {plan.isFree ? (
                    <Button 
                        onClick={() => window.location.href = '/'}
                        className="w-full text-lg py-6 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold"
                        disabled={isLoading === plan.priceId}
                    >
                        {plan.actionLabel}
                    </Button>
                ) : (
                    <Button 
                        onClick={() => handleCheckout(plan.priceId, plan.name)} 
                        className={`w-full text-lg py-6 font-semibold ${plan.highlight ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover-glow' : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                        disabled={isLoading === plan.priceId}
                    >
                        {isLoading === plan.priceId ? 'Processing...' : plan.actionLabel}
                    </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
       <motion.div variants={itemVariants} className="mt-12 text-center text-gray-400 p-6 glassmorphic rounded-lg">
        <ShieldAlert className="h-10 w-10 mx-auto mb-3 text-purple-400" />
        <p className="text-lg font-semibold text-gray-200 mb-2">Custom Domain Setup:</p>
        <p>
          For "Pro Custom Domain" plan, after purchase, you will receive instructions on how to point your domain's DNS records (usually A or CNAME records) to our service. This allows your custom domain to work with our URL shortener.
          Actual implementation of dynamic custom domain routing is a complex backend feature and is simplified here for demonstration.
        </p>
        <p className="mt-3 text-sm">
            Please replace <code className="bg-slate-700 px-1 rounded">YOUR_STRIPE_PUBLISHABLE_KEY_HERE</code> and <code className="bg-slate-700 px-1 rounded">PRICE_ID_HERE</code> in the code with your actual Stripe keys for payments to work.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PricingPage;