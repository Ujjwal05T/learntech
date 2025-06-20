import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, Mail, Calendar, Users, Lock, Eye, FileText, Phone } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060317] to-[#0c0825] text-white">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-pink-600/10 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-12 w-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </div>
            
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-lg px-4 py-2 inline-flex items-center gap-2 border border-gray-800/30 mb-4">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300 text-sm">Last updated: December 2024</span>
            </div>
          
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Learnext (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This Privacy Policy explains how we collect, 
              use, and protect your personal information when you use our platform.
            </p>
          </div>

          <div className="space-y-8">
            {/* Information We Collect */}
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Eye className="h-5 w-5 text-blue-400" />
                  1. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  We collect the following information when you use our platform:
                </p>
                
                <div className="grid md:grid-cols-1 gap-4">
                  <div className="bg-blue-600/10 p-4 rounded-lg border border-blue-500/20">
                    <h4 className="font-semibold text-blue-300 mb-2">Google Account Information</h4>
                    <p className="text-blue-200 text-sm">
                      When you sign in via Google OAuth, we access your name, email, and profile picture.
                    </p>
                  </div>
                  
                  <div className="bg-green-600/10 p-4 rounded-lg border border-green-500/20">
                    <h4 className="font-semibold text-green-300 mb-2">User Activity</h4>
                    <p className="text-green-200 text-sm">
                      Your progress in roadmaps, MCQ test scores, and video session engagement data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Users className="h-5 w-5 text-green-400" />
                  2. How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">We use your data to:</p>
                <ul className="space-y-3">
                  {[
                    "Personalize your learning experience (e.g., save progress, recommend content)",
                    "Track test performance and provide detailed analytics",
                    "Provide access to expert sessions and webinars",
                    "Send important updates and notifications about your account",
                    "Improve our platform and develop new features",
                    "Ensure platform security and prevent fraud"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Google OAuth Disclosure */}
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  3. Google OAuth Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-600/10 p-4 rounded-lg border border-amber-500/20">
                  <p className="text-gray-300">
                    Our platform uses <strong className="text-amber-300">Google OAuth</strong> for secure authentication. We do not store your Google password. 
                    Google provides us with your basic profile data (name, email, picture) only after your explicit consent.
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  <strong>Important:</strong> You can revoke access at any time from your 
                  <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" 
                     className="text-blue-400 hover:text-blue-300 hover:underline ml-1">Google Account Permissions</a>.
                </p>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Users className="h-5 w-5 text-orange-400" />
                  4. Data Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-600/10 p-4 rounded-lg border border-red-500/20 mb-4">
                  <p className="text-red-300 font-medium">
                    We do not sell, rent, or share your personal information with third parties.
                  </p>
                </div>
                <p className="text-gray-300 mb-3">We may share data only in these limited circumstances:</p>
                <ul className="space-y-2">
                  {[
                    "To comply with legal obligations or court orders",
                    "With your explicit consent for specific purposes",
                    "With trusted vendors (e.g., analytics, hosting, or email services) under strict data agreements",
                    "In case of business transfer or merger (with prior notification)"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Lock className="h-5 w-5 text-red-400" />
                  5. Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  We use industry-standard security measures to protect your data, including:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: "🔒", title: "HTTPS Encryption", desc: "All data transmitted is encrypted in transit" },
                    { icon: "🗄️", title: "Secure Databases", desc: "Protected database storage with access controls" },
                    { icon: "🎫", title: "Authentication Tokens", desc: "Secure JWT tokens for user authentication" },
                    { icon: "👥", title: "Access Controls", desc: "Limited access to personal data on need-to-know basis" }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <h4 className="font-medium text-white">{item.title}</h4>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <FileText className="h-5 w-5 text-purple-400" />
                  6. Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">You have the right to:</p>
                <div className="space-y-3">
                  {[
                    { title: "Access & Update", desc: "View and modify your personal data through your account settings" },
                    { title: "Data Deletion", desc: "Request complete deletion of your account and associated data" },
                    { title: "OAuth Revocation", desc: "Revoke Google OAuth permissions at any time" },
                    { title: "Data Portability", desc: "Request a copy of your data in a machine-readable format" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium text-purple-300">{item.title}:</span>
                        <span className="text-purple-200 ml-1">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Shield className="h-5 w-5 text-blue-400" />
                  7. Children&apos;s Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-600/10 p-4 rounded-lg border border-blue-500/20">
                  <p className="text-blue-200">
                    Our services are not directed at children under the age of 13. We do not knowingly collect 
                    personal information from minors. If you believe we have collected information from a child 
                    under 13, please contact us immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Calendar className="h-5 w-5 text-green-400" />
                  8. Changes to This Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                  We&apos;ll notify you of significant changes via:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Email notifications to your registered email</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    </div>
                    <span className="text-gray-300">In-app notifications when you next visit</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Us */}
            <Card className="bg-gray-900/40 backdrop-blur-sm border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors">
              <CardHeader>
               <CardTitle className="flex items-center gap-2 text-xl text-white">
                 <Phone className="h-5 w-5 text-blue-400" />
                 9. Contact Us
               </CardTitle>
              </CardHeader>
              <CardContent>
               <p className="text-gray-300 mb-4">
                 For questions, concerns, or data requests, contact us at:
               </p>
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <a href="mailto:info@learnext.live" className="text-blue-400 hover:text-blue-300 hover:underline font-medium">
                    info@learnext.live
                  </a>
                 </div>
                 <div className="text-sm text-gray-400">
                  We aim to respond to all privacy-related inquiries within 7 business days.
                 </div>
               </div>
              </CardContent>
            </Card>

            <Separator className="my-8 bg-gray-700/50" />
            
            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pb-8">
              <p>© 2025 Learnext. All rights reserved.</p>
              <p className="mt-2">
                By using our platform, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}