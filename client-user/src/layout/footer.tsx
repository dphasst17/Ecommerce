import { Button, Input } from "@nextui-org/react"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react"
const Footer = (): JSX.Element => {
  return <footer className="bg-slate-900 text-slate-200">
  <div className="footer-container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Company Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Tech Store</h3>
        <p className="text-slate-400 text-sm">
          Your one-stop destination for quality products at affordable prices.
        </p>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span>123 Commerce St, City, Country</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-slate-400" />
          <span>+1 (555) 123-4567</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-slate-400" />
          <span>support@techstore.com</span>
        </div>
      </div>

      {/* Shop Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Shop</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <p className="text-slate-400 hover:text-white transition-colors">
              New Arrivals
            </p>
          </li>
          <li>
            <p className="text-slate-400 hover:text-white transition-colors">
              Best Sellers
            </p>
          </li>
          <li>
            <p className="text-slate-400 hover:text-white transition-colors">
              Featured Products
            </p>
          </li>
          <li>
            <p className="text-slate-400 hover:text-white transition-colors">
              Special Offers
            </p>
          </li>
          <li>
            <p className="text-slate-400 hover:text-white transition-colors">
              All Products
            </p>
          </li>
        </ul>
      </div>

      {/* Customer Service */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Service</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <p  className="text-slate-400 hover:text-white transition-colors">
              Contact Us
            </p>
          </li>
          <li>
            <p className="text-slate-400 hover:text-white transition-colors">
              FAQs
            </p>
          </li>
          <li>
            <p className="text-slate-400 hover:text-white transition-colors">
              Shipping & Delivery
            </p>
          </li>
          <li>
            <p className="text-slate-400 hover:text-white transition-colors">
              Returns & Exchanges
            </p>
          </li>
          <li>
            <p  className="text-slate-400 hover:text-white transition-colors">
              Track Your Order
            </p>
          </li>
        </ul>
      </div>

      {/* Newsletter */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stay Updated</h3>
        <p className="text-slate-400 text-sm">Subscribe to our newsletter for exclusive offers and updates.</p>
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            placeholder="Your email address"
            className="bg-slate-800 border-slate-700 text-white"
          />
          <Button className="w-full">Subscribe</Button>
        </div>
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Follow Us</h4>
          <div className="flex gap-4">
            <p className="text-slate-400 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </p>
            <p className="text-slate-400 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </p>
            <p className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </p>
            <p className="text-slate-400 hover:text-white transition-colors">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Payment Methods */}
    <div className="mt-12 border-t border-slate-800 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <span className="text-sm text-slate-400">We Accept:</span>
          <div className="flex gap-2">
            {/* {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
              <span key={method} className="bg-slate-800 text-xs px-2 py-1 rounded">
                {method}
              </span>
            ))} */}
          </div>
        </div>
        <div className="text-sm text-slate-400">© {new Date().getFullYear()} Tech Store. All rights reserved.</div>
      </div>
    </div>

    {/* Legal Links */}
    <div className="mt-6 text-center md:text-right">
      <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-slate-500">
        <p  className="hover:text-slate-300 transition-colors">
          Privacy Policy
        </p>
        <p  className="hover:text-slate-300 transition-colors">
          Terms of Service
        </p>
        <p className="hover:text-slate-300 transition-colors">
          Cookie Policy
        </p>
      </div>
    </div>
  </div>
</footer>
}

export default Footer